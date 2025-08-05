const token = localStorage.getItem('coachToken');
if (!token) window.location.href = 'coachLogin.html';

const list = document.getElementById('notesList');

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/coach/notes`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await res.json();
    list.innerHTML = '';

    if (!data.length) {
      list.innerHTML = '<li>No notes found.</li>';
      return;
    }

    data.forEach(note => {
      li = document.createElement('li');
      li.innerHTML = `
        <strong>Note ID:</strong> ${note.noteId}<br>
        <strong>Content:</strong> ${note.content}<br>
        <strong>Patient ID:</strong> ${note.patientId}<br>
        <strong>Tags:</strong> ${(note.tagIds || []).join(', ') || 'None'}<br>
        <hr/>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching notes:', err);
    list.innerHTML = '<li>Failed to load notes.</li>';
  }
});
