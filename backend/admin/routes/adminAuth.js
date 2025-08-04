// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { dynamo } = require('../../shared/aws-config');

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

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    if (!admin.approved) {
      return res.status(403).json({ error: 'Admin account not approved yet' });
    }

    if (admin.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      fullname: admin.fullname
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
