
 // author: Mohamed Yanaal Iqbal
const ReminderModel = require('../models/reminderModel');

const addReminder = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { title, time } = req.body;

    if (!title || !time) {
      return res.status(400).json({ error: 'Title and time are required.' });
    }

    const reminder = await ReminderModel.addReminder(userId, title, time);
    res.status(201).json({ message: 'Reminder added.', reminder });
  } catch (err) {
    console.error('Add reminder error:', err);
    res.status(500).json({ error: 'Failed to add reminder.' });
  }
};

const getReminders = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const reminders = await ReminderModel.getReminders(userId);
    res.status(200).json({ reminders });
  } catch (err) {
    console.error('Fetch reminders error:', err);
    res.status(500).json({ error: 'Failed to fetch reminders.' });
  }
};

const updateReminder = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;
    const { title, time } = req.body;

    const updated = await ReminderModel.updateReminder(userId, id, title, time);
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
    const userId = req.user?.sub;
    const { id } = req.params;

    const deleted = await ReminderModel.deleteReminder(userId, id);
    if (!deleted) {
      return res.status(403).json({ error: 'Unauthorized or not found.' });
    }

    res.status(200).json({ message: 'Reminder deleted.' });
  } catch (err) {
    console.error('Delete reminder error:', err);
    res.status(500).json({ error: 'Failed to delete reminder.' });
  }
};

module.exports = {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
};