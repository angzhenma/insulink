const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
  window.location.href = '../index.html';
}

const adminList = document.getElementById('adminList');

async function fetchAdmins() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/pending-approved', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    adminList.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(admin => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <p><strong>${admin.fullname}</strong> (${admin.email})</p>
          <button class="primary-btn" onclick="approve('${admin.email}')">✅ Approve</button>
          <button class="primary-btn" onclick="remove('${admin.email}')">🗑 Remove</button>
        `;
        adminList.appendChild(div);
      });
    } else {
      adminList.innerHTML = '<p>No unapproved admins found.</p>';
    }
  } catch (err) {
    adminList.innerHTML = '<p>Failed to fetch data.</p>';
  }
}

async function approve(email) {
  await fetch('http://localhost:3000/api/admin/approve-existing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email })
  });
  alert('Approved!');
  fetchAdmins();
}

async function remove(email) {
  await fetch('http://localhost:3000/api/admin/delete-existing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email })
  });
  alert('Deleted!');
  fetchAdmins();
}

function logout() {
  localStorage.clear();
  window.location.href = '../index.html';
}

fetchAdmins();
