const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const TABLE_NAME = 'CoachBookmarks';

// Add new bookmark
router.post('/', async (req, res) => {
    const { bookmarkId, title, url, userId } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Item: {
            bookmarkId,
            title,
            url,
            userId, // ✅ required (sort key)
        },
    };

    try {
        await dynamoDB.put(params).promise();
        res.status(201).json({ message: 'Bookmark added successfully' });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({ error: 'Could not add bookmark' });
    }
});

module.exports = router;
