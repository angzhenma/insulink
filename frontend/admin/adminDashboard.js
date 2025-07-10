window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log('Token:', localStorage.getItem('token'));
  console.log('Role:', localStorage.getItem('role'));


  if (!token || role !== 'admin') {
    return window.location.href = '../index.html';
  }

  if (name) {
    document.getElementById('welcomeMessage').textContent = `Welcome, ${name}`;
  }

  const res = await fetch('http://localhost:3000/api/admin/register-request', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const requests = await res.json();
  const container = document.getElementById('adminRequests');

  if (!requests.length) {
    container.innerHTML = '<p>No pending requests.</p>';
    return;
  }

  requests.forEach(req => {
    const card = document.createElement('div');
    card.innerHTML = `
      <p><strong>${req.fullname}</strong> (${req.email})</p>
      <button onclick="approve('${req.requestId}')">Approve</button>
      <button onclick="reject('${req.requestId}')">Reject</button>
      <hr/>
    `;
    container.appendChild(card);
  });
});

async function approve(requestId) {
  await fetch('http://localhost:3000/api/admin/register-request/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId })
  });
  alert('Approved ✅');
  location.reload();
}

async function reject(requestId) {
  await fetch('http://localhost:3000/api/admin/register-request/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId })
  });
  alert('Rejected ❌');
  location.reload();
}

function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminFullname');
  window.location.href = '../index.html';
}
