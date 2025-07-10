document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const role = document.getElementById('role').value;

  if (password !== confirmPassword) {
    return alert('Passwords do not match!');
  }

  const endpointMap = {
    admin: '/api/admin/register-request',
    coach: '/api/coach/register',
    patient: '/api/patient/register'
  };

  const endpoint = endpointMap[role];

  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    alert(role === 'admin'
      ? 'Your request to register as an admin has been submitted. Please wait for approval.'
      : 'Registration successful. Please log in.');

    window.location.href = 'index.html';
  } catch (err) {
    alert('Registration failed: ' + err.message);
  }
});

