const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: String,
  examType: String, // JAMB, WAEC, NECO
  department: String, // Art, Commercial, Science
  subjects: [String], // Array of subjects
  duration: Number,
  numQuestions: Number,
  passMark: Number,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Exam', examSchema);