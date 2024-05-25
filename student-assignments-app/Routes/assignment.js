const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, updateAssignment, deleteAssignment } = require('../Controllers/assignmentController');
const authenticateJWT = require('../Middleware/authMiddleware');

router.post('/create', authenticateJWT, createAssignment);
router.get('/get-all', authenticateJWT, getAssignments);
router.put('/update/:id', authenticateJWT, updateAssignment);
router.delete('/delete/:id', authenticateJWT, deleteAssignment);

module.exports = router;
