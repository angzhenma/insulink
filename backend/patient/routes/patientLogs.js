const express = require('express');
const router = express.Router();
const verifyPatient = require('../middleware/mockPatientAuth');
const {
  logHealthData,
  getHealthLogs,
  getWeeklySummary
} = require('../controllers/patientLogsController');

router.use(verifyPatient);

router.post('/log', logHealthData);
router.get('/log', getHealthLogs);
router.get('/summary', getWeeklySummary);

module.exports = router;