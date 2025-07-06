document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('login-error');

  try {
    const response = await fetch('http://localhost:3000/coach/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.token) {
      localStorage.setItem('coachToken', result.token);
      window.location.href = 'coach/coachDashboard.html';
    } else {
      errorEl.textContent = result.error || 'Login failed.';
    }
  } catch (err) {
    errorEl.textContent = 'Error connecting to backend.';
  }
});
