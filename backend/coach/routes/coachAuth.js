const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded coach credentials
const COACH_CREDENTIALS = {
  email: 'coach@insulink.com',
  password: 'coach123',
  role: 'coach'
};

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'insulink_super_secret_key';
const JWT_EXPIRES_IN = '3h';

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === COACH_CREDENTIALS.email && password === COACH_CREDENTIALS.password) {
    const token = jwt.sign(
      {
        email: COACH_CREDENTIALS.email,
        role: COACH_CREDENTIALS.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Login successful',
      token
    });
  }

  return res.status(401).json({ error: 'Invalid email or password' });
});

module.exports = router;
