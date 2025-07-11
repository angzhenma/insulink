const token = localStorage.getItem('coachToken');
if (!token) window.location.href = '../coachLogin.html';

const list = document.getElementById('log-list');

async function fetchLogs() {
  try {
    const res = await fetch('http://localhost:3000/api/logs/patient', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    list.innerHTML = '';
    data.logs.forEach((l) => {
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
