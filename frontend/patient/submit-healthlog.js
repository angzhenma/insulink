const token = localStorage.getItem('patientToken');
const form = document.getElementById('healthLogForm');
const msg = document.getElementById('responseMsg');

if (!token) {
  window.location.href = '../../index.html';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    bloodGlucose: document.getElementById('bloodGlucose').value.trim(),
    foodIntake: document.getElementById('foodIntake').value.trim(),
    physicalActivity: document.getElementById('physicalActivity').value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = '✅ Health Log Submitted Successfully.';
      msg.style.color = 'green';
      form.reset();
    } else {
      throw new Error(data.error || 'Submission failed.');
    }
  } catch (err) {
    msg.textContent = '❌ Error: ' + (err.message || 'Something went wrong.');
    msg.style.color = 'red';
  }
});

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}
