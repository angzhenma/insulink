const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamo } = require('../../admin/aws-config');
const router = express.Router();

// register as admin
router.post('/register-request', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const item = {
    requestId: uuidv4(),
    fullname,
    email,
    password, // hash in production
    status: 'pending',
    requestedAt: new Date().toISOString()
  };

  try {
    await dynamo.put({
      TableName: 'PendingAdmins',
      Item: item
    }).promise();

    res.status(201).json({ message: 'Admin request submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store admin request', details: err });
  }
});

// all pending admin requests
router.get('/', async (req, res) => {
  try {
    const result = await dynamo.scan({ TableName: 'PendingAdmins' }).promise();
    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending admins' });
  }
});

// 📌 Approve admin request
router.post('/approve', async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'Missing request ID' });

  try {
    // fetch pending request
    const data = await dynamo.get({
      TableName: 'PendingAdmins',
      Key: { requestId }
    }).promise();

    const request = data.Item;
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // add to Admins table
    await dynamo.put({
      TableName: 'Admins',
      Item: {
        adminId: uuidv4(),
        fullname: request.fullname,
        email: request.email,
        password: request.password,
        createdAt: new Date().toISOString()
      }
    }).promise();

    // Delete from pending
    await dynamo.delete({
      TableName: 'PendingAdmins',
      Key: { requestId }
    }).promise();

    res.json({ message: 'Admin approved and promoted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Approval failed', details: err });
  }
});

// reject admin request
router.post('/reject', async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ error: 'Missing request ID' });

  try {
    await dynamo.delete({
      TableName: 'PendingAdmins',
      Key: { requestId }
    }).promise();

    res.json({ message: 'Admin request rejected and deleted' });

  } catch (err) {
    res.status(500).json({ error: 'Rejection failed' });
  }
});

module.exports = router;
