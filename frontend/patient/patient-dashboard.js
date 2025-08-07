// author: Mohamed Yanaal Iqbal
const token = localStorage.getItem('patientToken');
const fullname = localStorage.getItem('fullname');

if (!token) {
  window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const welcomeEl = document.getElementById('welcomeMessage');
  if (fullname && welcomeEl) {
    welcomeEl.textContent = `Welcome, ${fullname}`;
  }
});

function logout() {
  localStorage.removeItem('patientToken');
  localStorage.removeItem('fullname');
  window.location.href = '../index.html';
}
