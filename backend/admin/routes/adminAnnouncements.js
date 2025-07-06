const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamo } = require('../aws-config');
const verifyAdmin = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyAdmin, async (req, res) => {
    const { title, body } = req.body;
    const timestamp = new Date().toISOString();

    const item = {
        announcementId: uuidv4(),
        title,
        body,
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    try {
        await dynamo.put({
            TableName: 'SystemAnnouncements',
            Item: item,
        }).promise();
        res.status(201).json(item);
    } catch (err) {
        console.error('Error creating announcement:', err);
        res.status(500).json({
            error: 'Failed to create announcement'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await dynamo.scan({
            TableName: 'SystemAnnouncements',
        }).promise();
        res.json(result.Items);
    } catch (err) {
        console.error('DynamoDB scan error:', err);
        res.status(500).json({
            error: 'Failed to fetch announcements'
        });
    }
});

module.exports = router;