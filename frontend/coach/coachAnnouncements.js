const token = localStorage.getItem('coachToken');
const list = document.getElementById('announcement-list');

if (!token) {
  window.location.href = 'coachLogin.html';
}

async function fetchAnnouncements() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/coach/announcements`, {
      headers: {
        'Authorization': 'Bearer ' + token }
    });

    const data = await res.json();
    list.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((a) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${a.title}</strong><br>
          ${a.body}<br>
          <small>Posted: ${new Date(a.createdAt).toLocaleString()}</small>
          <hr/>
        `;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = '<li>No announcements found.</li>';
    }
  } catch (err) {
    console.error('Error fetching announcements:', err);
    list.innerHTML = '<li>Failed to load announcements.</li>';
  }
}

fetchAnnouncements();
