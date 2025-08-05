// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// redirect if not logged in as admin
if (!token || role !== 'admin') {
  window.location.href = '../index.html';
}

const adminList = document.getElementById('adminList');

// fetch all unapproved admins
async function fetchAdmins() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/pending-approved`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Fetch failed');
      } else {
        const text = await res.text();
        throw new Error(`Fetch failed: ${text}`);
      }
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`Unexpected response format:\n\n${text}`);
    }

    const data = await res.json();

    adminList.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(admin => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <p><strong>${admin.fullname}</strong> (${admin.email})</p>
          <button class="primary-btn" onclick="approve('${admin.email}')">✅ Approve</button>
          <button class="primary-btn" onclick="removeAdmin('${admin.email}')">🗑 Remove</button>
        `;
        adminList.appendChild(div);
      });
    } else {
      adminList.innerHTML = '<p>No unapproved admins found.</p>';
    }

  } catch (err) {
    console.error('[Admin Fetch Error]', err);
    adminList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// approve
async function approve(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/approve-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Approval failed');

    alert('✅ Approved!');
    fetchAdmins();

  } catch (err) {
    console.error('[Approval Error]', err);
    alert('❌ ' + err.message);
  }
}

// delete
async function removeAdmin(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/delete-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Deletion failed');

    alert('🗑 Deleted!');
    fetchAdmins();

  } catch (err) {
    console.error('[Delete Error]', err);
    alert('❌ ' + err.message);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '../index.html';
}

fetchAdmins();
