const api = '/api';

const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

const subjectOptions = {
  JAMB: {
    Art: ['Use of English', 'Literature in English', 'Government', 'History', 'CRS', 'IRS'],
    Commercial: ['Use of English', 'Economics', 'Commerce', 'Accounting', 'Government'],
    Science: ['Use of English', 'Mathematics', 'Physics', 'Chemistry', 'Biology']
  },
  WAEC: {
    Commercial: ['English Language', 'Mathematics', 'Economics', 'Financial Accounting', 'Commerce', 'Marketing', 'Office Practice', 'Government', 'Business Studies'],
    Art: ['English Language', 'Mathematics', 'Literature in English', 'Government', 'History', 'CRS', 'IRS', 'Yoruba', 'Igbo', 'Hausa', 'French', 'Music', 'Fine Arts', 'Food and Nutrition', 'Economics'],
    Science: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Agricultural Science', 'Geography', 'Technical Drawing', 'Further Mathematics', 'ICT']
  },
  NECO: {
    // Assuming similar to WAEC
    Commercial: ['English Language', 'Mathematics', 'Economics', 'Financial Accounting', 'Commerce', 'Marketing', 'Office Practice', 'Government', 'Business Studies'],
    Art: ['English Language', 'Mathematics', 'Literature in English', 'Government', 'History', 'CRS', 'IRS', 'Yoruba', 'Igbo', 'Hausa', 'French', 'Music', 'Fine Arts', 'Food and Nutrition', 'Economics'],
    Science: ['English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Agricultural Science', 'Geography', 'Technical Drawing', 'Further Mathematics', 'ICT']
  }
};

document.getElementById('next1').addEventListener('click', () => {
  if (document.getElementById('examType').value) {
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
  }
});

document.getElementById('back1').addEventListener('click', () => {
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
});

document.getElementById('next2').addEventListener('click', () => {
  if (document.getElementById('department').value) {
    const examType = document.getElementById('examType').value;
    const department = document.getElementById('department').value;
    const subjects = subjectOptions[examType][department];
    const subjectsDiv = document.getElementById('subjects');
    subjectsDiv.innerHTML = '';
    subjects.forEach(sub => {
      const label = document.createElement('label');
      label.className = 'block';
      label.innerHTML = `<input type="checkbox" value="${sub}" class="mr-2"> ${sub}`;
      subjectsDiv.appendChild(label);
    });
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.remove('hidden');
  }
});

document.getElementById('back2').addEventListener('click', () => {
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
});

document.getElementById('next3').addEventListener('click', () => {
  const selectedSubjects = Array.from(document.querySelectorAll('#subjects input:checked')).map(cb => cb.value);
  if (selectedSubjects.length > 0) {
    const examType = document.getElementById('examType').value;
    const department = document.getElementById('department').value;
    localStorage.setItem('examSelections', JSON.stringify({ examType, department, subjects: selectedSubjects }));
    window.location.href = 'exam.html';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

document.getElementById('historyBtn').addEventListener('click', () => {
  window.location.href = 'history.html';
});