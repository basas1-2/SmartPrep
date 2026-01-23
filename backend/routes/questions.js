const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/for-exam', auth, async (req, res) => {
  try {
    const { examType, department, subjects } = req.query;
    const subjArray = subjects.split(',');
    const questions = await Question.find({ examType, department, subject: { $in: subjArray } });
    const shuffled = questions.sort(() => Math.random() - 0.5);
    res.json(shuffled);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const question = new Question(req.body);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;