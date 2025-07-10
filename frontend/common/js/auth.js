document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const endpoints = {
    admin: '/api/admin/login',
    coach: '/api/coach/login',
    patient: '/api/patient/login'
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
        localStorage.setItem(`${role}Token`, data.token);
        if (data.fullname) {
          localStorage.setItem(`${role}Fullname`, data.fullname);
        }

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
