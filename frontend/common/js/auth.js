document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('login-error');

  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.token) {
      localStorage.setItem('adminToken', result.token);
      window.location.href = 'admin/adminDashboard.html';
    } else {
      errorEl.textContent = result.error || 'Login failed.';
    }
  } catch (err) {
    errorEl.textContent = 'Error connecting to backend.';
  }
});