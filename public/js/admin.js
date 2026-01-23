const api = 'http://localhost:5001/api';

const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

document.getElementById('addQBtn').addEventListener('click', async () => {
  const question = {
    examType: document.getElementById('qExamType').value,
    department: document.getElementById('qDepartment').value,
    subject: document.getElementById('qSubject').value,
    question: document.getElementById('qText').value,
    options: [
      document.getElementById('opt1').value,
      document.getElementById('opt2').value,
      document.getElementById('opt3').value,
      document.getElementById('opt4').value
    ],
    correctAnswer: parseInt(document.getElementById('correct').value)
  };
  const res = await fetch(`${api}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(question)
  });
  if (res.ok) alert('Question added');
  else alert('Error');
});

document.getElementById('addExamBtn').addEventListener('click', addExam);

async function addExam() {
  const examType = document.getElementById('examType').value;
  const department = document.getElementById('examDepartment').value;
  const subjects = document.getElementById('examSubjects').value.split(',').map(s => s.trim());
  const exam = {
    name: document.getElementById('examName').value,
    examType,
    department,
    subjects,
    duration: parseInt(document.getElementById('duration').value),
    numQuestions: parseInt(document.getElementById('numQ').value),
    passMark: parseInt(document.getElementById('passMark').value)
  };
  const res = await fetch(`${api}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(exam)
  });
  if (res.ok) alert('Exam added');
  else alert('Error');
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});