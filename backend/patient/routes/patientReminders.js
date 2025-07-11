
 // author: Mohamed Yanaal Iqbal
const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../middleware/authMiddleware');
const reminderController = require('../controllers/reminderController');

router.use(verifyPatient);

router.post('/reminders', reminderController.addReminder);
router.get('/reminders', reminderController.getReminders);
router.put('/reminders/:id', reminderController.updateReminder);
router.delete('/reminders/:id', reminderController.deleteReminder);

module.exports = router;