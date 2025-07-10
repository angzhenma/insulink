const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const TABLE_NAME = 'CoachBookmarks';

// Add new bookmark
router.post('/', async (req, res) => {
  const { bookmarkId, title, url, coachId } = req.body;

  if (!bookmarkId || !title || !url || !coachId) {
    return res.status(400).json({ error: 'All fields are required (bookmarkId, title, url, coachId)' });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      bookmarkId, // Partition key
      coachId,    // Sort key
      title,
      url,
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

// Get all bookmarks
router.get('/', async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Could not fetch bookmarks' });
  }
});

module.exports = router;
