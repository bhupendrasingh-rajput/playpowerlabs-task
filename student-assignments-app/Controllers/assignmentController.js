const Assignment = require('../Models/assignment');
const User = require('../Models/user');
const Submission = require('../Models/submission');

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, totalScore, username } = req.body;
    if (!title || !description || !dueDate || !username) { return res.status(400).json("Bad Request!") };
    const user = await User.findOne({ where: { username } });
    if (user.role === "student") { return res.status(400).json({ message: 'Permission Denied' }) }
    const assignment = await Assignment.create({ title, description, dueDate, totalScore, username });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { username } = req.body;
    const { sortBy, order, dueDate } = req.query;
    if (!username) { return res.status(401).json({ message: 'Bad Request' }) };

    const filter = { where: { username } };

    if (sortBy && order) {
      filter.order = [[sortBy, order]];
    }

    if (dueDate) {
      filter.where.dueDate = dueDate;
    }

    const assignments = await Assignment.findAll(filter);
    res.json(assignments);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, totalScore, username } = req.body;
    const { id } = req.params;
    const assignment = await Assignment.findOne({ where: { id, username } });
    if (!assignment) { return res.status(404).json({ error: 'Assignment not found' }); }
    assignment.title = title;
    assignment.description = description;
    assignment.dueDate = dueDate;
    assignment.totalScore = totalScore;
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { username } = req.body;
    const { id } = req.params;
    const assignment = await Assignment.findOne({ where: { id, username } });
    if (!assignment) { return res.status(404).json({ error: 'Assignment not found' }); }
    await assignment.destroy();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, username, submissionContent } = req.body;
    if (!assignmentId, !submissionContent) { return res.status(400).json({ message: "Bad Request!" }) };

    const user = await User.findOne({ where: { username } });

    if (user.role === "teacher") { return res.status(400).json({ message: 'Only Students Allowed!' }) }

    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const submission = await Submission.create({
      assignmentId,
      studentUsername: username,
      submissionContent,
      score: null
    });

    res.json({ message: 'Assignment submitted', submission });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const scoreAssignment = async (req, res) => {
  try {
    const { assignmentId, studentUsername, score } = req.body;

    const teacher = await User.findOne({ where: { username: req.body.username } });

    if (teacher.role !== "teacher") { return res.status(400).json({ message: 'Permission Denied!' }) }

    const submission = await Submission.findOne({ where: { assignmentId, studentUsername } });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.score = score;

    await submission.save();

    res.json({ message: 'Assignment graded', submission });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStudentReports = async (req, res) => {
  try {
    const { studentUsername, username } = req.body;
    const teacher = await User.findOne({ where: { username } });
    if (teacher.role !== "teacher") { return res.status(400).json({ message: 'Only Teachers Allowed!' }) }

    const submissions = await Submission.findAll({
      where: { studentUsername },
      include: [{ model: Assignment, attributes: ['title', 'dueDate'] }]
    });

    res.json(submissions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  scoreAssignment,
  getStudentReports
};