// author: AUWESULLA BAIG
const express = require('express');
const router = express.Router();
const dynamoDB = require('../../shared/aws-config');

const TABLE_NAME = 'CoachFeedback';

// Send feedback
router.post('/', async (req, res) => {
  const { feedbackId, message, patientId } = req.body;

  // Get coach ID from JWT token (attached by verifyCoach middleware)
  const coachId = req.user.email || req.user.sub; 

  if (!feedbackId || !message || !patientId || !coachId) {
    return res.status(400).json({ error: 'All fields are required (feedbackId, message, patientId, coachId)' });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      feedbackId, // Partition key
      coachId,    // Sort key
      message,
      patientId,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending feedback:', error);
    res.status(500).json({ error: 'Could not send feedback' });
  }
});

module.exports = router;

