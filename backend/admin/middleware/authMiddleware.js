// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'insulink_super_secret_key';

function verifyToken(req, res, next, allowedRole) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (allowedRole && decoded.role !== allowedRole) {
      return res.status(403).json({ error: `Forbidden: ${allowedRole}s only` });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware for each role
function verifyAdmin(req, res, next) {
  verifyToken(req, res, next, 'admin');
}

function verifyCoach(req, res, next) {
  verifyToken(req, res, next, 'coach');
}

function verifyPatient(req, res, next) {
  verifyToken(req, res, next, 'patient');
}

module.exports = { verifyAdmin, verifyCoach, verifyPatient };
