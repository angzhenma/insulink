// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const express = require('express');
const { dynamo } = require('../aws-config');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// fetch all feedback
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const result = await dynamo.scan({ TableName: 'CoachFeedback' }).promise();
    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback', details: err });
  }
});

// fetch uncategorized feedback
router.get('/uncategorized', verifyAdmin, async (req, res) => {
  try {
    const result = await dynamo.scan({
      TableName: 'CoachFeedback',
      FilterExpression: 'attribute_not_exists(#cat) OR #cat = :empty',
      ExpressionAttributeNames: { '#cat': 'category' },
      ExpressionAttributeValues: { ':empty': '' }
    }).promise();

    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch uncategorized feedback', details: err });
  }
});

// update category
router.post('/update-category', verifyAdmin, async (req, res) => {
  const { feedbackId, category } = req.body;

  if (!feedbackId || !category) {
    return res.status(400).json({ error: 'Missing feedbackId or category' });
  }

  try {
    await dynamo.update({
      TableName: 'CoachFeedback',
      Key: { feedbackId },
      UpdateExpression: 'SET #category = :val',
      ExpressionAttributeNames: { '#category': 'category' },
      ExpressionAttributeValues: { ':val': category }
    }).promise();

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category', details: err });
  }
});

module.exports = router;
