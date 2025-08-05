
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('patientToken'); 
  fetch(`${API_BASE_URL}/api/patient/api/patient/announcements`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('announcement-list');
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(ann => {
          const div = document.createElement('div');
          div.classList.add('announcement');
          div.innerHTML = `
            <h3>${ann.title}</h3>
            <p>${ann.body}</p>
            <small>Posted on: ${new Date(ann.createdAt).toLocaleString()}</small>
            <hr/>
          `;
          list.appendChild(div);
        });
      } else {
        list.innerHTML = '<p>No announcements found.</p>';
      }
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('announcement-list').innerHTML = '<p>Error loading announcements.</p>';
    });
});
