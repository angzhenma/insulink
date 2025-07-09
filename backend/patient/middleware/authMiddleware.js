const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

let pems = null;

async function getPems() {
  if (pems) return pems;

  const url = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
  const { data } = await axios.get(url);

  pems = {};
  data.keys.forEach(key => {
    pems[key.kid] = jwkToPem(key);
  });

  return pems;
}

async function verifyCognitoToken(req, res, next, allowedRole) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    const pems = await getPems();
    const pem = pems[decodedHeader.header.kid];

    if (!pem) {
      return res.status(401).json({ error: 'Invalid token: PEM not found' });
    }

    jwt.verify(
      token,
      pem,
      {
        issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      },
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Token verification failed' });
        }

        const userRole = decoded['custom:role']; // Assuming role is stored as custom attribute

        if (allowedRole && userRole !== allowedRole) {
          return res.status(403).json({ error: `Forbidden: ${allowedRole}s only` });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Token verification failed' });
  }
}

// Export only the patient verifier for now
function verifyPatient(req, res, next) {
  verifyCognitoToken(req, res, next, 'patient');
}

module.exports = { verifyPatient };
