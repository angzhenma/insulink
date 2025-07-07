// routes/patientFeedbackRoutes.js
const express = require('express');
const router = express.Router();
// const verifyToken = require('../middleware/verifyToken'); // optional for local testing
const controller = require('../controllers/feedbackController');

router.get('/', controller.getFeedback); // for local test, skip verifyToken

module.exports = router;
