// author: Mohamed Yanaal Iqbal
const token = localStorage.getItem('patientToken');
if (!token) {
  window.location.href = '../../index.html';
}

const API_BASE_URL = window.API_BASE_URL || 'http://54.82.37.85:3000'; // fallback
const apiBase = `${API_BASE_URL}/api/patient/notes`;

const container = document.getElementById('notes-container');
const noteForm = document.getElementById('note-form');
const input = document.getElementById('note-input');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

function setMessage(type, message) {
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  const target = type === 'success' ? successMsg : errorMsg;
  target.textContent = message;
  target.style.display = 'block';

  setTimeout(() => {
    target.style.display = 'none';
  }, 4000);
}

function renderNote(note) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.dataset.id = note.id;

  const timestamp = new Date(note.createdAt).toLocaleString();

  card.innerHTML = `
    <div class="timestamp">Created: ${timestamp}</div>
    <textarea rows="3" disabled>${note.content}</textarea>
    <div class="note-actions">
      <button class="btn btn-primary" onclick="editNote(this)">Edit</button>
      <button class="btn btn-secondary" onclick="deleteNote('${note.id}')">Delete</button>
    </div>
  `;
  container.appendChild(card);
}

async function fetchNotes() {
  container.innerHTML = '';
  try {
    const res = await fetch(apiBase, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) return setMessage('error', data.error || 'Failed to load notes.');

    if (Array.isArray(data.notes) && data.notes.length > 0) {
      data.notes.forEach(renderNote);
    } else {
      container.innerHTML = '<p class="no-notes">No notes found.</p>';
    }
  } catch {
    setMessage('error', 'Server error. Please try again later.');
  }
}

noteForm.addEventListener('submit', async e => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return setMessage('error', 'Note cannot be empty.');

  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await res.json();

    if (!res.ok) return setMessage('error', data.error || 'Failed to add note.');

    input.value = '';
    setMessage('success', 'Note added successfully.');
    fetchNotes();
  } catch {
    setMessage('error', 'Unable to submit note. Try again later.');
  }
});

async function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) return;

  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      setMessage('success', 'Note deleted.');
      fetchNotes();
    } else {
      setMessage('error', 'Failed to delete note.');
    }
  } catch {
    setMessage('error', 'Server error while deleting.');
  }
}

function editNote(btn) {
  const card = btn.closest('.note-card');
  const textarea = card.querySelector('textarea');
  const id = card.dataset.id;

  if (btn.textContent === 'Edit') {
    textarea.disabled = false;
    textarea.focus();
    btn.textContent = 'Save';
  } else {
    const updatedContent = textarea.value.trim();
    if (!updatedContent) {
      return setMessage('error', 'Note content is empty.');
    }

    fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: updatedContent })
    })
      .then(res => {
        if (res.ok) {
          textarea.disabled = true;
          btn.textContent = 'Edit';
          setMessage('success', 'Note updated.');
        } else {
          setMessage('error', 'Failed to update note.');
        }
      })
      .catch(() => {
        setMessage('error', 'Error occurred while updating.');
      });
  }
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}

fetchNotes();
