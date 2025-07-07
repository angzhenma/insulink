// controllers/reminderController.js

const ReminderModel = require('../models/reminderModel');

const addReminder = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
    const { message, time } = req.body;

    if (!message || !time) {
      return res.status(400).json({ error: 'Message and time are required.' });
    }

    const reminder = await ReminderModel.addReminder(userId, message, time);
    res.status(201).json({ message: 'Reminder set.', reminder });
  } catch (err) {
    console.error('Add reminder error:', err);
    res.status(500).json({ error: 'Failed to set reminder.' });
  }
};

const getReminders = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
    const reminders = await ReminderModel.getReminders(userId);
    res.status(200).json({ message: 'Reminders retrieved.', reminders });
  } catch (err) {
    console.error('Fetch reminder error:', err);
    res.status(500).json({ error: 'Failed to fetch reminders.' });
  }
};


const updateReminder = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
    const { id } = req.params;
    const { message, time } = req.body;

    const updated = await ReminderModel.updateReminder(userId, id, message, time);

    if (!updated) {
      return res.status(404).json({ error: 'Reminder not found.' });
    }

    res.status(200).json({ message: 'Reminder updated.', reminder: updated });
  } catch (err) {
    console.error('Update reminder error:', err);
    res.status(500).json({ error: 'Failed to update reminder.' });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
    const { id } = req.params;

    const deleted = await ReminderModel.deleteReminder(userId, id);

    if (!deleted) {
      return res.status(404).json({ error: 'Reminder not found.' });
    }

    res.status(200).json({ message: 'Reminder deleted.' });
  } catch (err) {
    console.error('Delete reminder error:', err);
    res.status(500).json({ error: 'Failed to delete reminder.' });
  }
};



module.exports = { addReminder, getReminders, updateReminder, deleteReminder };
