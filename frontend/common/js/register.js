document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullname = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('role').value;

  if (password !== confirmPassword) {
    return alert('Passwords do not match!');
  }

  const endpoint = {
    admin: '/api/admin/register-request',
    coach: '/api/coach/register',
    patient: '/api/patient/register'
  }[role];

  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    if (role === 'admin') {
      alert('Your request to register as an admin has been submitted. Please wait for approval.');
      window.location.href = 'index.html';
    } else {
      alert('Registration successful. Please log in.');
      window.location.href = 'index.html';
    }
  } catch (err) {
    alert('Registration failed: ' + err.message);
  }
});
