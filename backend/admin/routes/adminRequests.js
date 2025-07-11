const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { dynamo } = require('../aws-config');
const router = express.Router();

// register admin
router.post('/register-request', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const item = {
    adminId: uuidv4(),
    fullname,
    email,
    password,
    approved: false,
    createdAt: new Date().toISOString()
  };

  try {
    await dynamo.put({
      TableName: 'Admins',
      Item: item
    }).promise();

    res.status(201).json({ message: 'Admin registration submitted for approval' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store admin registration', details: err });
  }
});

// fetch all unapproved admins
router.get('/pending-approved', async (req, res) => {
  try {
    const result = await dynamo.scan({
      TableName: 'Admins',
      FilterExpression: '#approved = :falseVal',
      ExpressionAttributeNames: { '#approved': 'approved' },
      ExpressionAttributeValues: { ':falseVal': false }
    }).promise();

    res.json(result.Items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unapproved admins' });
  }
});

// approve pending admin
router.post('/approve-existing', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    await dynamo.update({
      TableName: 'Admins',
      Key: { email },
      UpdateExpression: 'SET #approved = :trueVal',
      ExpressionAttributeNames: { '#approved': 'approved' },
      ExpressionAttributeValues: { ':trueVal': true }
    }).promise();

    res.json({ message: 'Admin approved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed', details: err });
  }
});

// delete unapproved admin
router.post('/delete-existing', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    await dynamo.delete({
      TableName: 'Admins',
      Key: { email }
    }).promise();

    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed', details: err });
  }
});

module.exports = router;
