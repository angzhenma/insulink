// models/healthLogModel.js

// In-memory mock database
const testDataStore = {};

const logHealthData = async (userId, log) => {
  if (!testDataStore[userId]) {
    testDataStore[userId] = [];
  }

  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...log,
  };

  testDataStore[userId].push(newLog);
  return newLog;
};

const getHealthLogs = async (userId) => {
  return testDataStore[userId] || [];
};


module.exports = {
  logHealthData,
  getHealthLogs,
};
