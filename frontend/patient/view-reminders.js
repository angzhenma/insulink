// author: Mohamed Yanaal Iqbal
const token = localStorage.getItem('patientToken');
if (!token) window.location.href = '../../index.html';

const reminderList = document.getElementById('reminderList');
const errorMsg = document.getElementById('error-message');
const successMsg = document.getElementById('success-message');

async function fetchReminders() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/reminders`, {
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
    console.error('Error fetching reminders:', err);
    errorMsg.textContent = 'Failed to load reminders.';
    errorMsg.style.display = 'block';
  }
}

async function addReminder() {
  const title = document.getElementById('reminderMessage').value.trim();
  const time = document.getElementById('reminderTime').value.trim();
  errorMsg.textContent = '';
  successMsg.textContent = '';
  errorMsg.style.display = 'none';
  successMsg.style.display = 'none';

  if (!title || !time) {
    errorMsg.textContent = 'Both fields are required.';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/reminders`, {
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
      successMsg.style.display = 'block';
      document.getElementById('reminderMessage').value = '';
      document.getElementById('reminderTime').value = '';
      fetchReminders();
    } else {
      errorMsg.textContent = data.error || 'Failed to add reminder.';
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    console.error('Add reminder error:', err);
    errorMsg.textContent = 'Unexpected error occurred.';
    errorMsg.style.display = 'block';
  }
}

async function deleteReminder(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/reminders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (res.ok) fetchReminders();
  } catch (err) {
    console.error('Delete reminder error:', err);
  }
}

function editReminder(reminder) {
  const newTitle = prompt('Edit message:', reminder.title);
  const newTime = prompt('Edit time (HH:MM):', reminder.time);
  if (!newTitle || !newTime) return;

  fetch(`${API_BASE_URL}/api/patient/reminders/${reminder.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ title: newTitle, time: newTime })
  }).then(res => {
    if (res.ok) fetchReminders();
  }).catch(err => {
    console.error('Edit reminder error:', err);
  });
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}

fetchReminders();
