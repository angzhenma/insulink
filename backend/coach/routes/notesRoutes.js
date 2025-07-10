const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const TABLE_NAME = 'CoachCaseNotes';

// Create a note with optional tags
router.post('/', async (req, res) => {
  const { noteId, content, patientId, tagIds } = req.body;

  //Get coachId from JWT token (attached by verifyCoach middleware)
  const coachId = req.user.email || req.user.sub;

  if (!noteId || !coachId || !content || !patientId) {
    return res.status(400).json({ error: 'All fields are required (noteId, content, patientId, coachId)' });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      noteId,    // Partition key
      coachId,   // Sort key
      content,
      patientId,
      tagIds: tagIds || []
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Note created successfully' });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Could not create note' });
  }
});

//Get all notes
router.get('/', async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Could not fetch notes' });
  }
});

module.exports = router;
