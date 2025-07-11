const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getPatientByEmail } = require('../models/patientModel'); 
const JWT_SECRET = process.env.JWT_SECRET;

const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await getPatientByEmail(email);

    if (!patient) {
      console.log('Patient not found for email:', email);
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('Patient found:', patient.email);
    console.log('Comparing password:', password);
    console.log('With hash from DB:', patient.passwordHash);

    const isMatch = await bcrypt.compare(password, patient.passwordHash);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password matched. Generating token...');
    
    const token = jwt.sign(
  {
    sub: patient.email,  
    email: patient.email,
    role: 'patient'
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: patient.email,
        role: 'patient',
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginPatient };
