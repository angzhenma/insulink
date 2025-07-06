const token = localStorage.getItem('coachToken');
if (!token) window.location.href = '../coachLogin.html';

const form = document.getElementById('note-form');
const messageEl = document.getElementById('message-el');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const noteId = document.getElementById('noteId').value.trim();
  const userId = document.getElementById('userId').value.trim();
  const content = document.getElementById('content').value.trim();
  const patientId = document.getElementById('patientId').value.trim();

  try {
    const res = await fetch('http://localhost:3000/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ noteId, userId, content, patientId })
    });

    const result = await res.json();
    if (res.ok) {
      messageEl.textContent = '✅ Note created!';
      form.reset();
    } else {
      messageEl.textContent = result.error || '❌ Failed.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});

function logout() {
  localStorage.removeItem('coachToken');
  window.location.href = '../coachLogin.html';
}
