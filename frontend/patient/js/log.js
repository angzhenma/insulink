// frontend/patient/js/log.js

document.getElementById('healthLogForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const bloodGlucose = document.getElementById('bloodGlucose').value.trim();
  const foodIntake = document.getElementById('foodIntake').value.trim();
  const physicalActivity = document.getElementById('physicalActivity').value.trim();

  const data = { bloodGlucose, foodIntake, physicalActivity };

  try {
    const response = await fetch('http://localhost:5001/api/patient/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    const messageBox = document.getElementById('responseMessage');
    if (response.ok) {
      messageBox.style.color = 'green';
      messageBox.textContent = result.message;
    } else {
      messageBox.style.color = 'red';
      messageBox.textContent = result.error || 'An error occurred.';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('responseMessage').textContent = 'Server not responding.';
  }
});
