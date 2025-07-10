
function logout() { // Patient main hub page
  localStorage.removeItem('patientToken'); // Use the appropriate key
  window.location.href = '../index.html';
}