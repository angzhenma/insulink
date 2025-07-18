const token = localStorage.getItem('coachToken');
if (!token) window.location.href = 'coachLogin.html';

const form = document.getElementById('bookmark-form');
const messageEl = document.getElementById('message-el');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bookmarkId = document.getElementById('bookmarkId').value.trim();
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();

  try {
    const res = await fetch('http://54.82.37.85:4000/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ bookmarkId, title, url })
    });

    const result = await res.json();
    if (res.ok) {
      messageEl.textContent = 'Bookmark added!';
      form.reset();
    } else {
      messageEl.textContent = result.error || 'Failed.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});
