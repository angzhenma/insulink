const token = localStorage.getItem('adminToken');
const uploadForm = document.getElementById('upload-form');
const uploadMessage = document.getElementById('upload-message');

// redirect
if (!token) {
  window.location.href = '../index.html';
}

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const file = document.getElementById('file').files[0];

  if (!file) {
    uploadMessage.textContent = 'Please select a file.';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);

  try {
    const res = await fetch('http://localhost:3000/api/resources', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      uploadMessage.textContent = '✅ Upload successful!';
      uploadForm.reset();
    } else {
      uploadMessage.textContent = result.error || '❌ Upload failed.';
    }
  } catch (err) {
    uploadMessage.textContent = '❌ Error uploading file.';
  }
});

function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = '../index.html';
}