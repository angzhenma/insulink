const express = require('express');
const router = express.Router();
const { dynamo } = require('../../aws-config');
const { verifyCoach } = require('../../middleware/authMiddleware');

// Get all announcements
router.get('/', verifyCoach, async (req, res) => {
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
