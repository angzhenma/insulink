const PatientLogModel = require('../models/patientLogsModel');

const logHealthData = async (req, res) => {
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
};

const getHealthLogs = async (req, res) => {
  try {
    const userId = req.user.sub;
    const logs = await PatientLogModel.getHealthLogs(userId);

    res.status(200).json({
      message: 'Health logs retrieved.',
      logs
    });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve logs.' });
  }
};

const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user.sub;
    const logs = await PatientLogModel.getHealthLogs(userId);

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentLogs = logs.filter(log => new Date(log.timestamp) >= oneWeekAgo);

    if (recentLogs.length === 0) {
      return res.status(200).json({ message: 'No logs in the past 7 days.', summary: null });
    }

    const glucoseVals = recentLogs.map(log => parseFloat(log.bloodGlucose)).filter(val => !isNaN(val));
    const avgGlucose = glucoseVals.reduce((sum, val) => sum + val, 0) / glucoseVals.length;

    const mealsLogged = recentLogs.filter(log => log.foodIntake).length;
    const activitySessions = recentLogs.filter(log => log.physicalActivity).length;

    res.status(200).json({
      summary: {
        averageGlucose: avgGlucose.toFixed(1),
        mealsLogged,
        activitySessions,
        totalLogs: recentLogs.length
      }
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
};

module.exports = {
  logHealthData,
  getHealthLogs,
  getWeeklySummary
};