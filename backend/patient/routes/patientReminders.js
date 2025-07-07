// routes/patientReminders.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/reminderController');

// CREATE - Add reminder
router.post('/reminders', controller.addReminder);

// READ - Get all reminders
router.get('/reminders', controller.getReminders);

// UPDATE - Edit reminder
router.put('/reminders/:id', controller.updateReminder);

// DELETE - Remove reminder
router.delete('/reminders/:id', controller.deleteReminder);

module.exports = router;
