// controllers/noteController.js

const NoteModel = require('../models/noteModel');

const addNote = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
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
};

const getNotes = async (req, res) => {
  try {
    const userId = req.user?.sub || 'test-user-123';
    const notes = await NoteModel.getNotes(userId);
    res.status(200).json({ message: 'Notes retrieved.', notes });
  } catch (err) {
    console.error('Fetch notes error:', err);
    res.status(500).json({ error: 'Failed to retrieve notes.' });
  }
};

module.exports = { addNote, getNotes };
