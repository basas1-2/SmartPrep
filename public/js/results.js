const api = '/api';

const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

async function loadResults() {
  const res = await fetch(`${api}/results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const results = await res.json();
  const rDiv = document.getElementById('resultList');
  results.forEach(r => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow mb-4';
    div.innerHTML = `
      <h3 class="text-xl">${r.exam.name}</h3>
      <p>Score: ${r.score}/${r.total}</p>
      <p>Date: ${new Date(r.completedAt).toLocaleDateString()}</p>
    `;
    rDiv.appendChild(div);
  });
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

loadResults();