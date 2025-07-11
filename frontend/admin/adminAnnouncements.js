// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const token = localStorage.getItem('adminToken');
const form = document.getElementById('announcement-form');
const messageEl = document.getElementById('message');
const list = document.getElementById('announcement-list');

if (!token) {
  window.location.href = '../index.html';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('body').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ title, body })
    });

    const result = await res.json();

    if (res.ok) {
      messageEl.textContent = '✅ Announcement posted!';
      form.reset();
      fetchAnnouncements();
    } else {
      messageEl.textContent = result.error || 'Failed to post.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});

// Fetch and display announcements
async function fetchAnnouncements() {
  try {
    const res = await fetch('http://localhost:3000/api/announcements');
    const data = await res.json();

    list.innerHTML = '';

    if (Array.isArray(data)) {
      data.forEach((a) => {
        const li = document.createElement('li');
        li.textContent = `${a.title}: ${a.body}`;
        list.appendChild(li);
      });
    }
  } catch (err) {
    list.innerHTML = '<li>Failed to load announcements.</li>';
  }
}

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = '../index.html';
}

fetchAnnouncements();