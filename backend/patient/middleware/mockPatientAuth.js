
/**
 * MOCK LOGIN CONTROLLER FOR LOCAL TESTING ONLY
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  // Accept mocked token for local dev
  if (token === 'mocked-jwt-token-for-patient') {
    req.user = { sub: 'local-patient-user-id', email: 'testuser@example.com' };
    return next();
  }

  return res.status(403).json({ error: 'Invalid token (mock)' });
};

module.exports = verifyToken;