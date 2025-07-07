const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const controller = require('../controllers/patientLogsController');

// Use functions from controller object
router.post('/log', controller.logHealthData);
router.get('/log', controller.getHealthLogs);
router.get('/summary', controller.getWeeklySummary);

module.exports = router;
