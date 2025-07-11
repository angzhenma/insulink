const token = localStorage.getItem('patientToken');
if (!token) {
  window.location.href = '../index.html';
}

const resourceList = document.getElementById('resourceList');

async function fetchResources() {
  try {
    const res = await fetch('http://localhost:5001/api/patient/resources', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      resourceList.innerHTML = '<p>No resources available.</p>';
      return;
    }

    resourceList.innerHTML = data.map(r => `
      <div class="feedback-card">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <a href="${r.fileUrl}" target="_blank" class="primary-btn">📂 View</a>
      </div>
    `).join('');

  } catch (err) {
    console.error('Error fetching resources:', err);
    resourceList.innerHTML = '<p class="error">Failed to load resources.</p>';
  }
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../index.html';
}

fetchResources();
