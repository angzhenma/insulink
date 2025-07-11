const token = localStorage.getItem('coachToken');
if (!token) window.location.href = 'coachLogin.html';

const form = document.getElementById('note-form');
const tagSelect = document.getElementById('tagIds');
const messageEl = document.getElementById('message-el');

async function loadTags() {
  try {
    const res = await fetch('http://localhost:3000/api/tags', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    tagSelect.innerHTML = '';
    data.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag.tagId;
      option.textContent = tag.tagName;
      tagSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading tags:', err);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const noteId = document.getElementById('noteId').value.trim();
  const content = document.getElementById('content').value.trim();
  const patientId = document.getElementById('patientId').value.trim();
  const tagIds = Array.from(tagSelect.selectedOptions).map(opt => opt.value);

  try {
    const res = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ noteId, content, patientId, tagIds })
    });

    const result = await res.json();
    if (res.ok) {
      messageEl.textContent = 'Note created!';
      form.reset();
    } else {
      messageEl.textContent = result.error || 'Failed.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});

function logout() {
  localStorage.removeItem('coachToken');
  window.location.href = '../coachLogin.html';
}

loadTags();
