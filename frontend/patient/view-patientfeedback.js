// author: Mohamed Yanaal Iqbal
const token = localStorage.getItem('patientToken');

if (!token) {
  window.location.href = '../../index.html';
}

const container = document.getElementById('feedback-container');
const errorMsg = document.getElementById('error-message');

async function fetchFeedback() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/patient/`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch feedback.');
    }

    container.innerHTML = '';

    if (data.feedback && data.feedback.length > 0) {
      data.feedback.forEach(fb => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
          <h3>Feedback ID: ${fb.feedbackId}</h3>
          <p><strong>Message:</strong> ${fb.message}</p>
          <p><strong>Coach ID:</strong> ${fb.userId}</p>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<p style="text-align:center;">No feedback found.</p>';
    }
  } catch (err) {
    errorMsg.style.display = 'block';
    errorMsg.textContent = err.message || 'An unexpected error occurred.';
  }
}

function logout() {
  localStorage.removeItem('patientToken');
  window.location.href = '../../index.html';
}

fetchFeedback();
