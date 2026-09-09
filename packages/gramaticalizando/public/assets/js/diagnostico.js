import { initPage } from './page-base.js';
import { getSession, getUsers, saveUsers, saveSession } from './storage.js';

initPage();

const form = document.getElementById('diagnosticForm');
const objectiveField = document.getElementById('objetivo');
const materiaField = document.getElementById('materia');
const examField = document.getElementById('prova');
const weeklyField = document.getElementById('horas');
const studyLevel = document.querySelectorAll('input[name="nivel"]');
const confidenceField = document.querySelectorAll('input[name="confianca"]');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nivel = Array.from(studyLevel).find((input) => input.checked)?.value || '';
  const confianca = Array.from(confidenceField).find((input) => input.checked)?.value || '';

  const payload = {
    objetivo: objectiveField.value,
    materia: materiaField.value,
    prova: examField.value,
    horas_semanais: weeklyField.value,
    nivel: nivel,
    confianca: confianca,
    criadoEm: new Date().toISOString(),
  };

  localStorage.setItem('diagnostico_simples', JSON.stringify(payload));
  const session = getSession();
  if (session) {
    const users = getUsers();
    const userIndex = users.findIndex((user) => {
      if (user.id && session.id) {
        return user.id === session.id;
      }
      return String(user.email).toLowerCase() === String(session.email).toLowerCase();
    });

    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], diagnostico: payload };
      saveUsers(users);
    }

    saveSession({ ...session, diagnostico: payload });
  }
  window.location.href = './home.html';
});
