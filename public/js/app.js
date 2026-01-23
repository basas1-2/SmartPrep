let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));
let currentExam = null;
let timerInterval = null;
const api = '/api';

function showView(view) {
  document.querySelectorAll('#app > div').forEach(div => div.classList.add('hidden'));
  document.getElementById(view).classList.remove('hidden');
}

if (token) {
  if (user.role === 'admin') showView('admin');
  else loadExams();
} else {
  showView('login');
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${api}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    token = data.token;
    user = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.role === 'admin') showView('admin');
    else loadExams();
  } else {
    alert(data.message);
  }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const res = await fetch(`${api}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Registered, please login');
    showView('login');
  } else {
    alert(data.message);
  }
});

document.getElementById('showRegister').addEventListener('click', () => showView('register'));
document.getElementById('showLogin').addEventListener('click', () => showView('login'));

async function loadExams() {
  const res = await fetch(`${api}/exams`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const exams = await res.json();
  const examsDiv = document.getElementById('exams');
  examsDiv.innerHTML = '';
  exams.forEach(exam => {
    const btn = document.createElement('button');
    btn.textContent = exam.name;
    btn.className = 'bg-blue-500 text-white p-2 m-2';
    btn.addEventListener('click', () => startExam(exam._id));
    examsDiv.appendChild(btn);
  });
  showView('examSelect');
}

async function startExam(examId) {
  const res = await fetch(`${api}/exams/${examId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  currentExam = await res.json();
  displayExam();
  startTimer(currentExam.duration * 60);
  showView('exam');
}

function displayExam() {
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = '';
  currentExam.questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${i+1}. ${q.question}</p>
      ${q.options.map((opt, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${opt}</label><br>`).join('')}
    `;
    qDiv.appendChild(div);
  });
}

function startTimer(seconds) {
  const timerDiv = document.getElementById('timer');
  timerInterval = setInterval(() => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerDiv.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
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
  currentExam.questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      answers.push({ question: q._id, selected: parseInt(selected.value) });
    }
  });
  const res = await fetch(`${api}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ examId: currentExam._id, answers })
  });
  const data = await res.json();
  alert(`Score: ${data.score}/${data.total}`);
  loadResults();
}

async function loadResults() {
  const res = await fetch(`${api}/results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const results = await res.json();
  const rDiv = document.getElementById('resultList');
  rDiv.innerHTML = '';
  results.forEach(r => {
    const div = document.createElement('div');
    div.textContent = `${r.exam.name}: ${r.score}/${r.total}`;
    rDiv.appendChild(div);
  });
  showView('results');
}

// Admin
document.getElementById('addQBtn').addEventListener('click', async () => {
  const question = {
    examType: document.getElementById('qType').value,
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
});

document.getElementById('addExamBtn').addEventListener('click', async () => {
  const exam = {
    name: document.getElementById('examName').value,
    type: document.getElementById('examType').value,
    duration: parseInt(document.getElementById('duration').value),
    numQuestions: parseInt(document.getElementById('numQ').value),
    passMark: parseInt(document.getElementById('passMark').value),
    questions: [] // To be populated manually or via another endpoint
  };
  const res = await fetch(`${api}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(exam)
  });
  if (res.ok) alert('Exam added');
});