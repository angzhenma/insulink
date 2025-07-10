const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const TABLE_NAME = 'CoachFeedback';

// Send feedback
router.post('/', async (req, res) => {
    const { feedbackId, message, patientId } = req.body;
    const userId = req.user.sub; // Get from JWT token instead of body

    const params = {
        TableName: TABLE_NAME,
        Item: {
            feedbackId,
            message,
            patientId,
            userId,
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
