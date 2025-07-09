const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../middleware/mockPatientAuth');
const controller = require('../controllers/feedbackController');

// Protect all routes
router.use(verifyPatient);

// GET - Retrieve feedback for the patient
router.get('/', controller.getFeedback);

module.exports = router;