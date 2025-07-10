const token = localStorage.getItem('coachToken');
if (!token) window.location.href = '../coachLogin.html';

const form = document.getElementById('log-form');
const messageEl = document.getElementById('message');
const list = document.getElementById('log-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const logId = document.getElementById('logId').value.trim();
  const userId = document.getElementById('userId').value.trim();
  const content = document.getElementById('content').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ logId, userId, content })
    });

    const result = await res.json();
    if (res.ok) {
      messageEl.textContent = 'Log added!';
      form.reset();
      fetchLogs();
    } else {
      messageEl.textContent = result.error || 'Failed.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});

async function fetchLogs() {
  try {
    const res = await fetch('http://localhost:3000/api/logs', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    list.innerHTML = '';
    data.forEach((l) => {
      const li = document.createElement('li');
      li.textContent = `${l.logId}: ${l.content}`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = '<li>Failed to load logs.</li>';
  }
}

function logout() {
  localStorage.removeItem('coachToken');
  window.location.href = '../coachLogin.html';
}

fetchLogs();
