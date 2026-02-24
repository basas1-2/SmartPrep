const api = '/api';

const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // To store answers as user progresses
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
  currentQuestionIndex = 0;
  userAnswers = {};
  displayQuestion();
  updateNavigationButtons();
  startTimer(60 * 60); // 60 minutes
}

function displayQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  const qDiv = document.getElementById('question');
  qDiv.innerHTML = `
    <p class="font-bold text-lg mb-4">${question.question}</p>
    <div class="space-y-3">
      ${question.options.map((opt, j) => {
        const isChecked = userAnswers[currentQuestionIndex] === j ? 'checked' : '';
        return `
          <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50 transition">
            <input type="radio" name="answer" value="${j}" ${isChecked} class="w-4 h-4 cursor-pointer" onchange="saveAnswer(${j})">
            <span class="ml-3 text-lg">${opt}</span>
          </label>
        `;
      }).join('')}
    </div>
  `;
  document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
}

function saveAnswer(selectedIndex) {
  userAnswers[currentQuestionIndex] = selectedIndex;
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;
  
  prevBtn.style.opacity = currentQuestionIndex === 0 ? '0.5' : '1';
  nextBtn.style.opacity = currentQuestionIndex === currentQuestions.length - 1 ? '0.5' : '1';
}

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
    updateNavigationButtons();
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
    updateNavigationButtons();
  }
});

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
    if (userAnswers[i] !== undefined) {
      answers.push({ question: q._id, selected: userAnswers[i] });
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