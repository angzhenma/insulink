// author: Mohamed Yanaal Iqbal
const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../../shared/middleware/authMiddleware');
const PatientLogModel = require('../models/patientLogsModel');

router.use(verifyPatient);

router.post('/log', async (req, res) => {
  try {
    const userId = req.user.sub;
    const { bloodGlucose, foodIntake, physicalActivity } = req.body;

    if (!bloodGlucose || !foodIntake || !physicalActivity) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const logEntry = await PatientLogModel.logHealthData(userId, {
      bloodGlucose,
      foodIntake,
      physicalActivity
    });

    res.status(201).json({
      message: 'Health data logged successfully.',
      logEntry
    });
  } catch (err) {
    console.error('Log error:', err);
    res.status(500).json({ error: 'Failed to log health data.' });
  }
});

router.get('/log', async (req, res) => {
  try {
    const userId = req.user.sub;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in token.' });
    }

    const logs = await PatientLogModel.getHealthLogs(userId);

    res.status(200).json({
      message: 'Health logs retrieved.',
      logs
    });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve logs.' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.sub;
    const logs = await PatientLogModel.getHealthLogs(userId);

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentLogs = logs.filter(log => new Date(log.timestamp) >= oneWeekAgo);

    if (recentLogs.length === 0) {
      return res.status(200).json({ message: 'No logs in the past 7 days.', summary: null });
    }

    const glucoseVals = recentLogs.map(log => parseFloat(log.bloodGlucose)).filter(val => !isNaN(val));
    const avgGlucose = glucoseVals.length > 0 ? glucoseVals.reduce((sum, val) => sum + val, 0) / glucoseVals.length : 0;

    const mealsLogged = recentLogs.filter(log => log.foodIntake).length;
    const activitySessions = recentLogs.filter(log => log.physicalActivity).length;

    res.status(200).json({
      message: 'Weekly summary generated.',
      summary: {
        avgGlucose: avgGlucose.toFixed(2),
        mealsLogged,
        activitySessions,
        totalLogs: recentLogs.length
      }
    });
  } catch (err) {
    console.error('Weekly summary error:', err);
    res.status(500).json({ error: 'Failed to generate weekly summary.' });
  }
});

module.exports = router;