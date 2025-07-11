
const token = localStorage.getItem('patientToken');
if (!token) window.location.href = '../../index.html';

const reminderList = document.getElementById('reminderList');
const errorMsg = document.getElementById('error-message');
const successMsg = document.getElementById('success-message');

async function fetchReminders() {
  try {
    const res = await fetch('http://54.82.37.85:5001/api/patient/reminders', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await res.json();
    reminderList.innerHTML = '';

    if (res.ok && data.reminders.length) {
      data.reminders.forEach(reminder => {
        const card = document.createElement('div');
        card.className = 'reminder-card';
        card.innerHTML = `
          <div><strong>${reminder.time}</strong> – ${reminder.title}</div>
          <div class="actions">
            <button class="edit" onclick='editReminder(${JSON.stringify(reminder)})'>Edit</button>
            <button onclick="deleteReminder('${reminder.id}')">Delete</button>
          </div>`;
        reminderList.appendChild(card);
      });
    } else {
      reminderList.innerHTML = '<p style="text-align:center;">No reminders set.</p>';
    }

  } catch (err) {
    errorMsg.textContent = 'Failed to load reminders.';
  }
}

async function addReminder() {
  const title = document.getElementById('reminderMessage').value.trim();
  const time = document.getElementById('reminderTime').value.trim();
  errorMsg.textContent = '';
  successMsg.textContent = '';

  if (!title || !time) {
    errorMsg.textContent = 'Both fields are required.';
    return;
  }

  const res = await fetch('http://54.82.37.85:5001/api/patient/reminders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ title, time })
  });

  const data = await res.json();

  if (res.ok) {
    successMsg.textContent = 'Reminder added.';
    document.getElementById('reminderMessage').value = '';
    document.getElementById('reminderTime').value = '';
    fetchReminders();
  } else {
    errorMsg.textContent = data.error || 'Failed to add reminder.';
  }
}

async function deleteReminder(id) {
  const res = await fetch(`http://54.82.37.85:5001/api/patient/reminders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  if (res.ok) fetchReminders();
}

function editReminder(reminder) {
  const newTitle = prompt('Edit message:', reminder.title);
  const newTime = prompt('Edit time (HH:MM):', reminder.time);
  if (!newTitle || !newTime) return;

  fetch(`http://54.82.37.85:5001/api/patient/reminders/${reminder.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ title: newTitle, time: newTime })
  }).then(res => {
    if (res.ok) fetchReminders();
  });
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}

fetchReminders();
