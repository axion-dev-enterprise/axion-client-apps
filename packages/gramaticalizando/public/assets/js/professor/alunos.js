import { initProfessorPage } from './base.js';
import { getUsers, getEssays } from '../storage.js';
import { normalizeSearch, formatDate, safeText } from './utils.js';

const session = initProfessorPage('students');
if (!session) throw new Error('Acesso negado.');

const studentSearch = document.getElementById('studentSearch');
const filterButtons = document.querySelectorAll('[data-filter]');
const studentTableBody = document.querySelector('#studentTable tbody');
const noStudentsMessage = document.getElementById('noStudentsMessage');
const studentModal = document.querySelector('[data-student-modal]');
const studentModalClose = document.querySelectorAll('[data-modal-close]');
const studentModalName = document.getElementById('studentModalName');
const studentModalEmail = document.getElementById('studentModalEmail');
const studentModalType = document.getElementById('studentModalType');
const studentModalDiagnosis = document.getElementById('studentModalDiagnosis');
const studentModalInfo = document.getElementById('studentModalInfo');

let currentFilter = 'all';
let users = getUsers();
const essays = getEssays();

const renderStudents = () => {
  const searchText = normalizeSearch(studentSearch.value);
  const filtered = users.filter((user) => {
    const matchesSearch = normalizeSearch(user.nome).includes(searchText) || normalizeSearch(user.email).includes(searchText);
    if (!matchesSearch) return false;
    if (currentFilter === 'active') return Boolean(user.diagnostico);
    if (currentFilter === 'inactive') return !user.diagnostico;
    return true;
  });

  if (!filtered.length) {
    studentTableBody.innerHTML = '';
    noStudentsMessage.style.display = 'block';
    return;
  }

  noStudentsMessage.style.display = 'none';
  studentTableBody.innerHTML = filtered.map((user) => {
    const count = essays.filter((essay) => essay.autor === user.email).length;
    const diagnosisLabel = user.diagnostico ? 'Concluído' : 'Pendente';
    return `
      <tr>
        <td>${safeText(user.nome)}</td>
        <td>${safeText(user.email)}</td>
        <td>${safeText(user.tipo)}</td>
        <td>${diagnosisLabel}</td>
        <td>${count}</td>
        <td><span class="status-chip ${user.diagnostico ? 'concluido' : 'pendente'}">${user.diagnostico ? 'Ativo' : 'Inativo'}</span></td>
        <td><button type="button" class="btn btn-secondary" data-view-student="${user.email}">Ver perfil</button></td>
      </tr>
    `;
  }).join('');

  studentTableBody.querySelectorAll('[data-view-student]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const email = event.currentTarget.dataset.viewStudent;
      const user = users.find((item) => item.email === email);
      if (!user) return;
      studentModalName.textContent = safeText(user.nome);
      studentModalEmail.textContent = safeText(user.email);
      studentModalType.textContent = safeText(user.tipo);
      studentModalDiagnosis.textContent = user.diagnostico ? 'Diagnóstico disponível' : 'Sem diagnóstico';
      studentModalInfo.textContent = user.diagnostico ? `Objetivo: ${user.diagnostico.objetivo || '—'} · Prova: ${user.diagnostico.prova || '—'} · Horas: ${user.diagnostico.horas_semanais || '—'}` : 'Nenhuma informação extra disponível.';
      studentModal.classList.remove('hidden');
    });
  });
};

studentSearch.addEventListener('input', renderStudents);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderStudents();
  });
});

studentModalClose.forEach((button) => {
  button.addEventListener('click', () => studentModal.classList.add('hidden'));
});

renderStudents();
