const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const PATIENT_LOGS_TABLE = 'PatientLogs';

// Get all patient logs
router.get('/patient', async (req, res) => {
  const params = {
    TableName: PATIENT_LOGS_TABLE,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json({
      message: 'Patient logs retrieved successfully.',
      logs: data.Items,
    });
  } catch (error) {
    console.error('Error fetching patient logs:', error);
    res.status(500).json({ error: 'Could not fetch patient logs' });
  }
});

module.exports = router;
