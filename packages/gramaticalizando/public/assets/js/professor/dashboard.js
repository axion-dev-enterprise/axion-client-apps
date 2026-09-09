import { initProfessorPage } from './base.js';
import { getUsers, getEssays } from '../storage.js';
import { formatDate, timeAgo } from './utils.js';

const session = initProfessorPage('dashboard');
if (!session) {
  throw new Error('Acesso negado ao painel do professor.');
}

const studentCount = document.getElementById('summaryStudents');
const pendingEssayCount = document.getElementById('summaryPendingEssays');
const reviewedEssayCount = document.getElementById('summaryReviewedEssays');
const diagnosticCount = document.getElementById('summaryDiagnostics');
const recentActivities = document.getElementById('recentActivities');

const users = getUsers();
const essays = getEssays();

const diagnostics = users.filter((user) => user.diagnostico);
const pendingEssays = essays.filter((essay) => essay.status === 'pendente');
const reviewedEssays = essays.filter((essay) => essay.status === 'concluido');

studentCount.textContent = users.length;
pendingEssayCount.textContent = pendingEssays.length;
reviewedEssayCount.textContent = reviewedEssays.length;
diagnosticCount.textContent = diagnostics.length;

const activities = [];

essays.forEach((essay) => {
  activities.push({
    type: 'essay',
    date: essay.criadoEm,
    title: 'Nova redação enviada',
    description: `${essay.autor || 'Aluno'} enviou uma nova redação`,
    target: './redacoes.html',
  });
});

diagnostics.forEach((user) => {
  activities.push({
    type: 'diagnostic',
    date: user.diagnostico.criadoEm,
    title: 'Diagnóstico concluído',
    description: `${user.nome || 'Aluno'} concluiu o diagnóstico`,
    target: './diagnosticos.html',
  });
});

activities.sort((a, b) => new Date(b.date) - new Date(a.date));
const visibleActivities = activities.slice(0, 5);

if (!visibleActivities.length) {
  recentActivities.innerHTML = '<div class="activity-item"><strong>Nenhuma atividade recente</strong><p>Ainda não há eventos registrados.</p></div>';
} else {
  recentActivities.innerHTML = visibleActivities.map((activity) => `
      <article class="activity-item">
        <strong>${activity.title}</strong>
        <div class="activity-meta">
          <span>${activity.description}</span>
          <span>${timeAgo(activity.date)}</span>
        </div>
        <a class="activity-link" href="${activity.target}">Ver todas</a>
      </article>
    `).join('');
}
