
 // author: Mohamed Yanaal Iqbal
const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../middleware/authMiddleware');
const controller = require('../controllers/feedbackController');

router.use(verifyPatient);

router.get('/', controller.getFeedback);

module.exports = router;