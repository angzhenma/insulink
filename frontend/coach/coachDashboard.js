function logout() {
  localStorage.removeItem('coachToken');
  window.location.href = '../coachLogin.html';
}
