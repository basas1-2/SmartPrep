const express = require('express');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { selections, answers } = req.body;
    const { examType, department, subjects } = selections;
    const questions = await Question.find({ examType, department, subject: { $in: subjects } });
    let score = 0;
    answers.forEach(ans => {
      const q = questions.find(qq => qq._id.toString() === ans.question);
      if (q && q.correctAnswer === ans.selected) score++;
    });
    const result = new Result({
      user: req.user.id,
      selections,
      score,
      total: questions.length,
      answers
    });
    await result.save();
    res.json({ score, total: questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const results = await Result.find().populate('user').sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;