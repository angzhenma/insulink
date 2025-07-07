// controllers/feedbackController.js
const FeedbackModel = require('../models/feedbackModel');

const getFeedback = async (req, res) => {
  try {
    const patientId = req.user?.sub || 'test-user-123'; // fallback for local testing
    const feedback = await FeedbackModel.getFeedbackForPatient(patientId);

    if (!feedback.length) {
      return res.status(200).json({
        message: 'No feedback found for this patient.',
        feedback: [],
      });
    }

    res.status(200).json({
      message: 'Feedback retrieved successfully.',
      feedback,
    });
  } catch (err) {
    console.error('Feedback fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve feedback.' });
  }
};

module.exports = { getFeedback };
