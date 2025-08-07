// author: AUWESULLA BAIG
const express = require('express');
const router = express.Router();
const dynamoDB = require('../../shared/aws-config');

const TABLE_NAME = 'CoachTags';

// Create tag
router.post('/', async (req, res) => {
  const { tagId, tagName } = req.body;

  if (!tagId || !tagName) {
    return res.status(400).json({ error: 'All fields are required (tagId, tagName)' });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      tagId,    // Partition key
      tagName,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Tag created successfully' });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Could not create tag' });
  }
});

// Get all tags
router.get('/', async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Could not fetch tags' });
  }
});

module.exports = router;

