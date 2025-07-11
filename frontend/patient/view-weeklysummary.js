
const token = localStorage.getItem('patientToken');
if (!token) {
  window.location.href = '../../index.html';
}

function showMessage(id, message, show = true) {
  const el = document.getElementById(id);
  if (!el) return; 
  el.textContent = message;
  el.style.display = show ? 'block' : 'none';
}

async function fetchSummary() {
  showMessage('status', 'Fetching your weekly health summary...');
  document.getElementById('summary-card').style.display = 'none';
  showMessage('error-message', '', false);

  try {
    const response = await fetch('http://54.82.37.85:5001/api/patient/summary', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();
    showMessage('status', '', false);

    if (!response.ok) {
      throw new Error(data.error || 'Unable to fetch summary.');
    }

    if (data.summary && Object.keys(data.summary).length > 0) {
      document.getElementById('summary-card').style.display = 'block';
      document.getElementById('avg-glucose').textContent = data.summary.averageGlucose;
      document.getElementById('activity-sessions').textContent = data.summary.activitySessions;
      document.getElementById('meals-logged').textContent = data.summary.mealsLogged;
      document.getElementById('total-logs').textContent = data.summary.totalLogs;
    } else {
      showMessage('error-message', 'No summary data available for this week.');
    }

  } catch (err) {
    showMessage('status', '', false);
    showMessage('error-message', err.message || 'Unable to retrieve summary at this time.');
  }
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}

fetchSummary();
