const express = require('express');
const router = express.Router();
const dynamoDB = require('../aws-config');

const TABLE_NAME = 'CoachCaseNotes';

// Create a note
router.post('/', async (req, res) => {
    const { noteId, userId, content, patientId } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Item: {
            noteId,   // Partition key
            userId,   // Sort key
            content,
            patientId,
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

module.exports = router;
