// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
  window.location.href = '../index.html';
}

const feedbackList = document.getElementById('feedbackList');
const message = document.getElementById('message');

async function loadFeedback() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-feedback/uncategorized`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    feedbackList.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${item.message}</strong><br/>
          Coach: ${item.coachId} | Patient: ${item.patientId}<br/>
          <label for="cat-${item.feedbackId}">Category:</label>
          <select id="cat-${item.feedbackId}">
            <option value="">--Select--</option>
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
            <option value="Critical">Critical</option>
          </select>
          <button onclick="assignCategory('${item.feedbackId}')">Assign</button>
        `;
        feedbackList.appendChild(li);
      });
    } else {
      feedbackList.innerHTML = '<li>No uncategorized feedback available.</li>';
    }
  } catch (err) {
    feedbackList.innerHTML = '<li>⚠️ Error loading feedback.</li>';
  }
}

async function assignCategory(feedbackId) {
  const select = document.getElementById(`cat-${feedbackId}`);
  const category = select.value;

  if (!category) {
    alert('Please select a category.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-feedback/assign-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ feedbackId, category })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');

    alert('✅ Category assigned!');
    loadFeedback();
  } catch (err) {
    alert('❌ ' + err.message);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '../index.html';
}

loadFeedback();
