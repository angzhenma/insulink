 
 // author: Mohamed Yanaal Iqbal
const form = document.getElementById('healthLogForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bloodGlucose = document.getElementById('bloodGlucose').value.trim();
  const foodIntake = document.getElementById('foodIntake').value.trim();
  const physicalActivity = document.getElementById('physicalActivity').value.trim();

  try {
    const res = await fetch('http://54.82.37.85:5001/api/patient/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bloodGlucose, foodIntake, physicalActivity })
    });

    const data = await res.json();

    if (res.ok) {
      responseMessage.style.color = 'green';
      responseMessage.textContent = 'Log submitted successfully!';
      form.reset();
    } else {
      responseMessage.style.color = 'red';
      responseMessage.textContent = data.error || 'Failed to submit log.';
    }
  } catch (err) {
    responseMessage.style.color = 'red';
    responseMessage.textContent = 'Error connecting to server.';
  }
});

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../index.html';
}
