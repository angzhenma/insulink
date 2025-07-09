
const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../middleware/authMiddleware'); 
const noteController = require('../controllers/noteController');

router.use(verifyPatient);

router.post('/note', noteController.addNote);
router.get('/note', noteController.getNotes);
router.put('/note/:id', noteController.updateNote);
router.delete('/note/:id', noteController.deleteNote);

module.exports = router;