const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examType: String, // JAMB, WAEC, NECO
  department: String, // Art, Commercial, Science
  subject: String, // e.g., Use of English, Mathematics
  question: String,
  options: [String],
  correctAnswer: Number
});

module.exports = mongoose.model('Question', questionSchema);