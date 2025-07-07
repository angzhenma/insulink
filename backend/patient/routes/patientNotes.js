// routes/patientNotes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/noteController');
const notesDB = {}; // Temporary in-memory store for testing only

// POST - Add new personal note
router.post('/note', controller.addNote);

// GET - Retrieve all personal notes
router.get('/note', controller.getNotes);

// PUT - Update personal notes
router.put('/note/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.sub || 'test-user-123';

  const updated = notesDB[userId]?.find(note => note.id == id);
  if (!updated) {
    return res.status(404).json({ error: 'Note not found.' });
  }

  updated.content = content;
  res.status(200).json({ message: 'Note updated.', note: updated });
});

// DELETE - Delete personal notes
router.delete('/note/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user?.sub || 'test-user-123';

  const userNotes = notesDB[userId];
  if (!userNotes) return res.status(404).json({ error: 'Note not found.' });

  const index = userNotes.findIndex(note => note.id == id);
  if (index === -1) {
    return res.status(404).json({ error: 'Note not found.' });
  }

  userNotes.splice(index, 1);
  res.status(200).json({ message: 'Note deleted.' });
});

module.exports = router;
