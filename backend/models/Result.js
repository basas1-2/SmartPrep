const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  selections: {
    examType: String,
    department: String,
    subjects: [String]
  },
  score: Number,
  total: Number,
  answers: [{ question: mongoose.Schema.Types.ObjectId, selected: Number }],
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);