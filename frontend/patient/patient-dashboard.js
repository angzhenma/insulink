
function logout() { 
  localStorage.removeItem('patientToken'); 
  window.location.href = '../index.html';
}