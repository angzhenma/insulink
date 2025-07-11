const token = localStorage.getItem('coachToken');
if (!token) window.location.href = 'coachLogin.html';

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
      li.innerHTML = `
        <strong>Patient ID:</strong> ${l.patientId || 'Unknown'}<br>
        <strong>Blood Glucose:</strong> ${l.bloodGlucose || 'N/A'}<br>
        <strong>Food Intake:</strong> ${l.foodIntake || 'N/A'}<br>
        <strong>Activity:</strong> ${l.physicalActivity || 'N/A'}<br>
        <hr/>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    list.innerHTML = '<li>Failed to load logs.</li>';
  }
}

fetchLogs();
