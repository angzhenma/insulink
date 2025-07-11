document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const API_BASE_URL = {
    admin: 'http://54.82.37.85:3000',
    coach: 'http://54.82.37.85:4000',
    patient: 'http://54.82.37.85:5001'
  };

  const endpoints = {
    admin: `${API_BASE_URL}/api/admin/login`,
    coach: `${API_BASE_URL}/api/coach/login`,
    patient: `${API_BASE_URL}/api/patient/login`
  };

  for (const role in endpoints) {
    try {
      const res = await fetch(endpoints[role], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem(`${role}Token`, data.token);
        if (data.fullname) {
          localStorage.setItem('fullname', data.fullname);
        }

        console.log(`Logged in as ${role}`);

        // redirect to correct dashboard
        const dashboardPages = {
          admin: 'admin/adminDashboard.html',
          coach: 'coach/coachDashboard.html',
          patient: 'patient/patient-dashboard.html'
        };

        window.location.href = dashboardPages[role];
        return;
      }
    } catch (err) {
      console.error(`Error trying ${role}:`, err);
    }
  }

  alert('Invalid login credentials. Please try again.');
});
