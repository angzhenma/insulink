// author: Mohamed Yanaal Iqbal
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { dynamo } = require('../../shared/aws-config');
const { v4: uuidv4 } = require('uuid');
const { getPatientByEmail } = require('../models/patientModel');

const JWT_SECRET = process.env.JWT_SECRET || 'insulink_super_secret_key';
const JWT_EXPIRES_IN = '7d';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await getPatientByEmail(email);

    if (!patient) {
      return res.status(401).json({ error: 'Patient not found' });
    }

    const passwordMatch = await bcrypt.compare(password, patient.password); // 🔥 bcrypt check
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      {
        sub: patient.patientId,
        email: patient.email,
        role: 'patient',
        patientId: patient.patientId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      fullname: patient.fullname
    });
  } catch (err) {
    console.error('Patient login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const scanParams = {
      TableName: 'Patients',
      ProjectionExpression: 'patientId'
    };

    const result = await dynamo.scan(scanParams).promise();
    const existingIds = result.Items.map(item => item.patientId);

    let maxNumber = 0;
    existingIds.forEach(id => {
      const num = parseInt(id.replace(/^p/, ''), 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    });

    const nextNumber = maxNumber + 1;
    const patientId = `p${nextNumber.toString().padStart(3, '0')}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const putParams = {
      TableName: 'Patients',
      Item: {
        email,
        fullname,
        password: hashedPassword,
        patientId,
        createdAt: new Date().toISOString()
      }
    };

    await dynamo.put(putParams).promise();

    const token = jwt.sign(
      {
        sub: patientId,
        email,
        role: 'patient',
        patientId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      fullname
    });
  } catch (err) {
    console.error('Patient registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
