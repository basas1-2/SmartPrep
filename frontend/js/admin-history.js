const api = 'http://localhost:5001/api';

const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

async function loadHistory() {
  const res = await fetch(`${api}/results/all`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const results = await res.json();
  const historyDiv = document.getElementById('history');
  results.forEach(result => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.innerHTML = `
      <p><strong>User:</strong> ${result.user.email}</p>
      <p><strong>Exam Type:</strong> ${result.selections.examType}</p>
      <p><strong>Department:</strong> ${result.selections.department}</p>
      <p><strong>Subjects:</strong> ${result.selections.subjects.join(', ')}</p>
      <p><strong>Score:</strong> ${result.score}/${result.total}</p>
      <p><strong>Date:</strong> ${new Date(result.completedAt).toLocaleString()}</p>
    `;
    historyDiv.appendChild(div);
  });
}

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'admin.html';
});

loadHistory();