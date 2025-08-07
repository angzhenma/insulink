// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const API_BASE_URL = window.location.origin;

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem(`${role}Token`, data.token);
        if (data.fullname) localStorage.setItem('fullname', data.fullname);

        const dashboardPages = {
          admin: 'admin/adminDashboard.html',
          coach: 'coach/coachDashboard.html',
          patient: 'patient/patient-dashboard.html'
        };

        window.location.href = dashboardPages[role];
        return;
      }
    } catch (err) {
      console.error(`Error logging in as ${role}:`, err);
    }
  }

  alert('Invalid login credentials. Please try again.');
});
