const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { dynamo } = require('../../aws-config');

const JWT_SECRET = process.env.JWT_SECRET || 'insulink_super_secret_key';
const JWT_EXPIRES_IN = '3h';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const params = {
    TableName: 'Admins',
    Key: { email }
  };

  try {
    const result = await dynamo.get(params).promise();
    const admin = result.Item;

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
