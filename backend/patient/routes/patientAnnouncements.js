const express = require('express');
const router = express.Router();
const { dynamo } = require('../aws-config');
const { verifyPatient } = require('../middleware/authMiddleware');

const TABLE_NAME = 'SystemAnnouncements';

router.get('/', verifyPatient, async (req, res) => {
  const params = {
    TableName: TABLE_NAME
  };

  try {
    const result = await dynamo.scan(params).promise();
    res.status(200).json(result.Items);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

module.exports = router;
