
 // author: Mohamed Yanaal Iqbal
const NoteModel = require('../models/noteModel');

const addNote = async (req, res) => {
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
};

const getNotes = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const notes = await NoteModel.getNotes(userId);
    res.status(200).json({ notes });
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ error: 'Failed to retrieve notes.' });
  }
};

const updateNote = async (req, res) => {
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
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;

    const deleted = await NoteModel.deleteNote(userId, id);
    if (!deleted) {
      return res.status(403).json({ error: 'Unauthorized or not found.' });
    }

    res.status(200).json({ message: 'Note deleted.' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Failed to delete note.' });
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
};