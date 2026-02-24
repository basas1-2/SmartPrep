const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('./models/Question');

async function importQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cbt');
    console.log('Connected to MongoDB');

    const questions = [];
    const csvFilePath = path.join(__dirname, 'JAMB_English_100_Questions.csv');

    // Read and parse CSV
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map correctAnswer letter to index (A=0, B=1, C=2, D=3)
        const answerMap = { A: 0, B: 1, C: 2, D: 3 };
        const correctAnswerIndex = answerMap[row.correctAnswer.toUpperCase()];

        const question = {
          examType: 'JAMB',
          department: 'Art',
          subject: 'Use of English',
          question: row.question,
          options: [row.optionA, row.optionB, row.optionC, row.optionD],
          correctAnswer: correctAnswerIndex
        };

        questions.push(question);
      })
      .on('end', async () => {
        try {
          // Insert all questions into database
          const result = await Question.insertMany(questions);
          console.log(`✓ Successfully imported ${result.length} questions to the database`);
          mongoose.connection.close();
          process.exit(0);
        } catch (error) {
          console.error('Error inserting questions:', error.message);
          mongoose.connection.close();
          process.exit(1);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error.message);
        mongoose.connection.close();
        process.exit(1);
      });
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
}

importQuestions();
