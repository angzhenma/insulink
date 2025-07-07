// models/noteModel.js

const noteStore = {}; // In-memory mock

const addNote = async (userId, content) => {
  if (!noteStore[userId]) noteStore[userId] = [];

  const note = {
    id: Date.now(),
    content,
    timestamp: new Date().toISOString(),
  };

  noteStore[userId].push(note);
  return note;
};

const getNotes = async (userId) => {
  return noteStore[userId] || [];
};

module.exports = { addNote, getNotes };
