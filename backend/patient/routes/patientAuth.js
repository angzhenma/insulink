
 // author: Mohamed Yanaal Iqbal
const express = require('express');
const router = express.Router();
const { loginPatient, registerPatient } = require('../controllers/patientAuthController');

router.post('/login', loginPatient);
router.post('/register', registerPatient)

module.exports = router;
