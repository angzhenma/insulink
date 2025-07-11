const token = localStorage.getItem('coachToken');
if (!token) window.location.href = 'coachLogin.html';

const form = document.getElementById('feedback-form');
const messageEl = document.getElementById('message-el');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const feedbackId = document.getElementById('feedbackId').value.trim();
  const message = document.getElementById('message').value.trim();
  const patientId = document.getElementById('patientId').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ feedbackId, message, patientId })
    });

    const result = await res.json();
    if (res.ok) {
      messageEl.textContent = 'Feedback sent successfully!';
      form.reset();
    } else {
      messageEl.textContent = result.error || 'Failed to send feedback.';
    }
  } catch (err) {
    messageEl.textContent = 'Error contacting server.';
  }
});
