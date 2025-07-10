const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamo } = require('../aws-config');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyAdmin, async (req, res) => {
  const { action, actorId, target, details } = req.body;
  const item = {
    logId: uuidv4(),
    action,
    actorId,
    target,
    details,
    timestamp: new Date().toISOString()
  };
  try {
    await dynamo.put({ TableName: 'AdminLogs', Item: item }).promise();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Could not log action' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await dynamo.scan({ TableName: 'AdminLogs' }).promise();
    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch logs' });
  }
});

module.exports = router;