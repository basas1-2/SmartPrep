const api = '/api';

const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

let currentQuestions = [];

let timerInterval = null;

async function loadExam() {
  const selections = JSON.parse(localStorage.getItem('examSelections'));
  const { examType, department, subjects } = selections;
  const subjectsStr = subjects.join(',');
  const res = await fetch(`${api}/questions/for-exam?examType=${examType}&department=${department}&subjects=${subjectsStr}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  currentQuestions = await res.json();
  console.log('Loaded questions:', currentQuestions);
  displayExam();
  startTimer(60 * 60); // 60 minutes
}

function displayExam() {
  const qDiv = document.getElementById('questions');
  currentQuestions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'mb-4';
    div.innerHTML = `
      <p class="font-bold">${i+1}. ${q.question}</p>
      ${q.options.map((opt, j) => `<label class="block"><input type="radio" name="q${i}" value="${j}"> ${opt}</label>`).join('')}
    `;
    qDiv.appendChild(div);
  });
}

function startTimer(seconds) {
  const timerDiv = document.getElementById('timer');
  timerInterval = setInterval(() => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerDiv.textContent = `Time Left: ${min}:${sec < 10 ? '0' : ''}${sec}`;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      submitExam();
    }
    seconds--;
  }, 1000);
}

document.getElementById('submitBtn').addEventListener('click', submitExam);

async function submitExam() {
  clearInterval(timerInterval);
  const answers = [];
  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      answers.push({ question: q._id, selected: parseInt(selected.value) });
    }
  });
  const selections = JSON.parse(localStorage.getItem('examSelections'));
  const res = await fetch(`${api}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ selections, answers })
  });
  const data = await res.json();
  alert(`Score: ${data.score}/${data.total}`);
  window.location.href = 'results.html';
}

loadExam();