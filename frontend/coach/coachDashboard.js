window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('coachToken');
  if (!token) {
    return window.location.href = '../coachLogin.html';
  }

  const list = document.getElementById('patientLogsList');

  try {
    const res = await fetch('http://localhost:3000/api/logs/patient', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await res.json();
    list.innerHTML = '';

    if (!data.logs || !data.logs.length) {
      list.innerHTML = '<li>No patient logs available.</li>';
      return;
    }

    data.logs.forEach(log => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Patient ID:</strong> ${log.userId || 'Unknown'}<br>
        <strong>Blood Glucose:</strong> ${log.bloodGlucose}<br>
        <strong>Food Intake:</strong> ${log.foodIntake}<br>
        <strong>Activity:</strong> ${log.physicalActivity}<br>
        <hr/>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading patient logs:', err);
    list.innerHTML = '<li>Failed to load patient logs.</li>';
  }
});

function logout() {
  localStorage.removeItem('coachToken');
  window.location.href = '../coachLogin.html';
}
