const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('./models/Question');

async function clearQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cbt');
    console.log('Connected to MongoDB');

    // Delete ALL questions
    const result = await Question.deleteMany({});

    console.log(`✓ Deleted ${result.deletedCount} questions from database`);
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

clearQuestions();
