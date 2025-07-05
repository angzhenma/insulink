const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// upgrade to DB later
const ADMIN_CREDENTIALS = {
  email: 'admin@insulink.com',
  password: 'azaan123',
  role: 'admin'
};

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'insulink_super_secret_key';
const JWT_EXPIRES_IN = '3h';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign(
      {
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role
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
