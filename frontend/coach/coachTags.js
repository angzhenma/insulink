const token = localStorage.getItem('coachToken');
if (!token) window.location.href = 'coachLogin.html';

const form = document.getElementById('tag-form');
const messageEl = document.getElementById('message-el');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const tagId = document.getElementById('tagId').value.trim();
  const tagName = document.getElementById('tagName').value.trim();

  try {
    const res = await fetch('http://54.82.37.85:4000/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ tagId, tagName })
    });

    const result = await res.json();
    if (res.ok) {
      messageEl.textContent = 'Tag created!';
      form.reset();
    } else {
      messageEl.textContent = result.error || 'Failed.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});
