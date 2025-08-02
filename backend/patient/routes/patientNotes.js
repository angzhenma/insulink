// author: Mohamed Yanaal Iqbal
const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../../shared/middleware/authMiddleware');
const NoteModel = require('../models/noteModel');

router.use(verifyPatient);

router.post('/note', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Note content is required.' });
    }

    const note = await NoteModel.addNote(userId, content);
    res.status(201).json({ message: 'Note added.', note });
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({ error: 'Failed to add note.' });
  }
});

router.get('/note', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const notes = await NoteModel.getNotes(userId);
    res.status(200).json({ notes });
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ error: 'Failed to retrieve notes.' });
  }
});

router.put('/note/:id', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;
    const { content } = req.body;

    const updated = await NoteModel.updateNote(userId, id, content);
    if (!updated) {
      return res.status(404).json({ error: 'Note not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Note updated.', note: updated });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ error: 'Failed to update note.' });
  }
});

router.delete('/note/:id', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;

    const deleted = await NoteModel.deleteNote(userId, id);
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Note deleted.' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

module.exports = router;