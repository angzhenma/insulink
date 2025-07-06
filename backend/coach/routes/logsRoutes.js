const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const TABLE_NAME = 'CoachLogs';

// Add new log
router.post('/', async (req, res) => {
    const { logId, userId, content } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Item: {
            logId,    // Partition key
            userId,   // Sort key
            content,  // field
        },
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Log added successfully' });
    } catch (error) {
        console.error('Error adding log:', error);
        res.status(500).json({ error: 'Could not add log' });
    }
});

// Get all logs
router.get('/', async (req, res) => {
    const params = {
        TableName: TABLE_NAME,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Could not fetch logs' });
    }
});

module.exports = router;
