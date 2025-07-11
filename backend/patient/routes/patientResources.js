const express = require('express');
const { dynamo } = require('../aws-config');
const router = express.Router();

router.get('/resources', async (req, res) => {
  try {
    const result = await dynamo.scan({ TableName: 'Resources' }).promise();
    res.json(result.Items);
  } catch (err) {
    console.error('Fetch resources error:', err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

module.exports = router;