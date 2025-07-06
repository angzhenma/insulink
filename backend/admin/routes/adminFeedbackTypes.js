const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamo } = require('../aws-config');
const verifyAdmin = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyAdmin, async (req, res) => {
    const { name } = req.body;
    const item = {
        feedbackTypeId: uuidv4(),
        name
    };
    try {
        await dynamo.put({
            TableName: 'FeedbackCategories',
            Item: item
        }).promise();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: 'Could note create category' })
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await dynamo.scan({
            TableName: 'FeebackCategories'
        }).promise();
        res.status(200).json(result.Items);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch categories' });
    }
});

module.exports = router;