window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('coachToken');
  if (!token) {
    return window.location.href = '../coachLogin.html';
  }

  const list = document.getElementById('bookmarksList');

  try {
    const res = await fetch('http://localhost:3000/bookmarks', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await res.json();
    list.innerHTML = '';

    if (!data.length) {
      list.innerHTML = '<li>No bookmarks found.</li>';
      return;
    }

    data.forEach(b => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${b.title}</strong><br>
        <a href="${b.url}" target="_blank">${b.url}</a>
        <hr/>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    list.innerHTML = '<li>Failed to load bookmarks.</li>';
  }
});
