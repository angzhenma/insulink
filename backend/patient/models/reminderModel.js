// models/reminderModel.js

const reminderStore = {};

const addReminder = async (userId, message, time) => {
  if (!reminderStore[userId]) reminderStore[userId] = [];

  const reminder = {
    id: Date.now(),
    message,
    time, 
    createdAt: new Date().toISOString(),
  };

  reminderStore[userId].push(reminder);
  return reminder;
};

const getReminders = async (userId) => {
  return reminderStore[userId] || [];
};

module.exports = { addReminder, getReminders };
