function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = '../index.html';
}