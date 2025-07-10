const token = localStorage.getItem('patientToken');
if (!token) {
  window.location.href = '../../index.html';
}

async function fetchSummary() {
  try {
    const response = await fetch('http://localhost:5001/api/patient/summary', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to fetch summary.');
    }

    if (data.summary) {
      document.getElementById('summary-card').style.display = 'block';
      document.getElementById('avg-glucose').textContent = data.summary.averageGlucose;
      document.getElementById('activity-sessions').textContent = data.summary.activitySessions;
      document.getElementById('meals-logged').textContent = data.summary.mealsLogged;
      document.getElementById('total-logs').textContent = data.summary.totalLogs;
    } else {
      document.getElementById('error-message').textContent = data.message || 'No data available.';
    }
  } catch (err) {
    document.getElementById('error-message').textContent = err.message;
  }
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}

fetchSummary();
