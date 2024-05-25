const express = require('express');
const router = express.Router();
const { submitAssignment, scoreAssignment, getStudentReports } = require('../Controllers/assignmentController');
const authenticateJWT = require('../Middleware/authMiddleware');

router.post('/submit', authenticateJWT, submitAssignment);
router.put('/assign-score', authenticateJWT, scoreAssignment);
router.get('/student-reports', authenticateJWT, getStudentReports);

module.exports = router;
