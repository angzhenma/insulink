// author: Mohamed Yanaal Iqbal
// const express = require('express');
// const router = express.Router();
// const { verifyPatient } = require('../../shared/middleware/authMiddleware');
// const { submitFeedback, getFeedback } = require('../models/patientFeedbackModel');

// router.use(verifyPatient);

// router.get('/', async (req, res) => {
//   try {
//     const patientId = req.user.sub;

//     const feedback = await FeedbackModel.getFeedbackForPatient(patientId);

//     if (!feedback.length) {
//       return res.status(200).json({
//         message: 'No feedback found for this patient.',
//         feedback: [],
//       });
//     }

//     res.status(200).json({
//       message: 'Feedback retrieved successfully.',
//       feedback,
//     });
//   } catch (err) {
//     console.error('Feedback fetch error:', err);
//     res.status(500).json({ error: 'Failed to retrieve feedback.' });
//   }
// });

// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  verifyPatient
} = require('../../shared/middleware/authMiddleware');
const {
  submitFeedback,
  getFeedback
} = require('../controllers/patientFeedbackController');

router.use(verifyPatient);

router.get('/', getFeedback);

router.post('/', submitFeedback);

module.exports = router;