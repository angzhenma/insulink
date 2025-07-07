// controllers/patientLogsController.js
const HealthLogModel = require('../models/healthLogModel');

const logHealthData = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123'; // TODO: Remove fallback before production – only use req.user.sub (from Cognito)
    const { bloodGlucose, foodIntake, physicalActivity } = req.body;

    if (!bloodGlucose || !foodIntake || !physicalActivity) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const logEntry = await HealthLogModel.logHealthData(userId, {
      bloodGlucose,
      foodIntake,
      physicalActivity,
    });

    res.status(201).json({
      message: 'Health data logged successfully!',
      logEntry,
    });
  } catch (err) {
    console.error('Log error:', err);
    res.status(500).json({ error: 'Failed to log health data!' });
  }
};

const getHealthLogs = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';

    const logs = await HealthLogModel.getHealthLogs(userId);

 res.status(200).json({
      message: 'Health logs retrieved successfully.',
      logs
    });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch health logs.' });
  }
};

const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
    const allLogs = await HealthLogModel.getHealthLogs(userId);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentLogs = allLogs.filter(log => new Date(log.timestamp) >= oneWeekAgo);

    if (recentLogs.length === 0) {
      return res.status(200).json({ message: 'No data in the past 7 days.', summary: null });
    }

    const glucoseValues = recentLogs.map(log => parseFloat(log.bloodGlucose));
    const avgGlucose = glucoseValues.reduce((sum, val) => sum + val, 0) / glucoseValues.length;

    const activityCount = recentLogs.filter(log => log.physicalActivity).length;
    const mealCount = recentLogs.filter(log => log.foodIntake).length;

    res.status(200).json({
      message: 'Weekly summary generated.',
      summary: {
        averageGlucose: avgGlucose.toFixed(1),
        activitySessions: activityCount,
        mealsLogged: mealCount,
        totalLogs: recentLogs.length,
      }
    });
  } catch (err) {
    console.error('Weekly summary error:', err);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
};


module.exports = {
  logHealthData,
  getHealthLogs, 
  getWeeklySummary,
};
