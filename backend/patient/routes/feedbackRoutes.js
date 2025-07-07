    // routes/feedbackRoutes.js

    const express = require('express');
    const router = express.Router();
    const dynamoDB = require('../aws-config');

    const FEEDBACK_TABLE = 'CoachFeedback';

    // GET feedback for the logged-in patient
    router.get('/', async (req, res) => {
    const patientId = req.user?.sub || 'test-user-123'; // fallback for local testing

    const params = {
        TableName: FEEDBACK_TABLE,
        FilterExpression: 'patientId = :pid',
        ExpressionAttributeValues: {
        ':pid': patientId,
        },
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.status(200).json({
        message: 'Feedback retrieved.',
        feedback: data.Items,
        });
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback.' });
    }
    });

    module.exports = router;
