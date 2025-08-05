// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamo, sns } = require('../../shared/aws-config');
const { verifyAdmin } = require('../../shared/middleware/authMiddleware');
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

        const params = {
            Message: `New system announcement: ${title}\n\n${body}`,
            Subject: `📢 New System Announcement: ${title}`,
            TopicArn: process.env.SNS_TOPIC_ARN,
        };

        const snsResult = await sns.publish(params).promise();
        console.log("SNS Message published:", snsResult.MessageId);

        res.status(201).json(item);
    } catch (err) {
        console.error('Error creating announcement or publushing SNS message:', err);
        res.status(500).json({
            error: 'Failed to create announcement or notify subscribers'
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