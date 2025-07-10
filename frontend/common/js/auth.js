document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const endpoint = {
    admin: '/api/admin/login',
    coach: '/api/coach/login',
    patient: '/api/patient/login',
  }[role];

  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', role);

    // Redirect to respective dashboard
    window.location.href = `/frontend/${role}/${role}Dashboard.html`;

  } catch (err) {
    alert('Login failed: ' + err.message);
  }
});
