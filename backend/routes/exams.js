const express = require('express');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (exam) {
      exam.questions = exam.questions.sort(() => Math.random() - 0.5);
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { examType, department, subjects } = req.body;
    const questions = [];
    for (const subject of subjects) {
      const qs = await Question.find({ examType, department, subject });
      questions.push(...qs);
    }
    // Shuffle and take numQuestions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, req.body.numQuestions);
    const exam = new Exam({
      ...req.body,
      questions: selectedQuestions.map(q => q._id)
    });
    await exam.save();
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;