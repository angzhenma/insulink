// patientAuthController.js

require('dotenv').config();

const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  // Simple mock validation
  if (email === 'testuser@example.com' && password === 'Test1234!') {
    return res.status(200).json({
      message: 'Login successful (mock)',
      token: 'mocked-jwt-token-for-patient',
      user: {
        email,
        role: 'patient',
        sub: 'local-patient-user-id'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid credentials (mock)' });
};

module.exports = { loginPatient };
