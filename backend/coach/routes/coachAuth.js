const express = require('express');
const jwt = require('jsonwebtoken');
const { dynamo } = require('../aws-config'); // adjust path if needed

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'insulink_super_secret_key';
const JWT_EXPIRES_IN = '3h';

// ✅ Coach Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const params = {
    TableName: 'Coaches',
    Key: { email }
  };

  try {
    const result = await dynamo.get(params).promise();
    const coach = result.Item;

    if (!coach) {
      return res.status(401).json({ error: 'Coach not found' });
    }

    if (coach.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { email: coach.email, role: 'coach' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      fullname: coach.fullname
    });
  } catch (err) {
    console.error('Coach login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Coach Register
router.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const params = {
    TableName: 'Coaches',
    Item: {
      email,
      fullname,
      password, // (Hash in production)
      createdAt: new Date().toISOString()
    }
  };

  try {
    await dynamo.put(params).promise();
    res.status(201).json({ message: 'Coach registered successfully' });
  } catch (err) {
    console.error('Coach register error:', err);
    res.status(500).json({ error: 'Failed to register coach' });
  }
});

module.exports = router;
