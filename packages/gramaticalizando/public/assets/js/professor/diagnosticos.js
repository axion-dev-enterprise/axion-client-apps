import { initProfessorPage } from './base.js';
import { getUsers } from '../storage.js';
import { formatDate, safeText } from './utils.js';

const session = initProfessorPage('diagnostics');
if (!session) throw new Error('Acesso negado.');

const diagnosticList = document.getElementById('diagnosticList');
const diagnosticModal = document.querySelector('[data-diagnostic-modal]');
const diagnosticModalClose = document.querySelectorAll('[data-modal-close]');
const diagnosticModalName = document.getElementById('diagnosticModalName');
const diagnosticModalDate = document.getElementById('diagnosticModalDate');
const diagnosticModalResult = document.getElementById('diagnosticModalResult');
const diagnosticModalStatus = document.getElementById('diagnosticModalStatus');
const diagnosticModalDetails = document.getElementById('diagnosticModalDetails');

const users = getUsers();
const diagnostics = users.filter((user) => user.diagnostico).sort((a, b) => new Date(b.diagnostico.criadoEm) - new Date(a.diagnostico.criadoEm));

if (!diagnostics.length) {
  diagnosticList.innerHTML = '<div class="activity-item"><strong>Nenhum diagnóstico registrado</strong><p>Os diagnósticos serão exibidos aqui assim que concluídos.</p></div>';
} else {
  diagnosticList.innerHTML = diagnostics.map((user) => {
    const diagnostic = user.diagnostico;
    return `
      <article class="activity-item">
        <strong>${safeText(user.nome)}</strong>
        <div class="activity-meta">
          <span>Diagnóstico concluído</span>
          <span>${formatDate(diagnostic.criadoEm)}</span>
        </div>
        <p>${diagnostic.objetivo ? `Objetivo: ${safeText(diagnostic.objetivo)}` : 'Diagnóstico completo.'}</p>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary" data-view-diagnostic="${user.email}">Ver diagnóstico</button>
        </div>
      </article>
    `;
  }).join('');
}

diagnosticList.querySelectorAll('[data-view-diagnostic]').forEach((button) => {
  button.addEventListener('click', (event) => {
    const email = event.currentTarget.dataset.viewDiagnostic;
    const user = users.find((item) => item.email === email);
    if (!user || !user.diagnostico) return;
    const diagnostic = user.diagnostico;
    diagnosticModalName.textContent = safeText(user.nome);
    diagnosticModalDate.textContent = formatDate(diagnostic.criadoEm);
    diagnosticModalResult.textContent = diagnostic.objetivo ? `Objetivo: ${safeText(diagnostic.objetivo)}` : 'Resultado disponível';
    diagnosticModalStatus.textContent = 'Concluído';
    diagnosticModalDetails.textContent = `Prova: ${safeText(diagnostic.prova)} · Horas/semana: ${safeText(diagnostic.horas_semanais)} · Nível: ${safeText(diagnostic.nivel)} · Confiança: ${safeText(diagnostic.confianca)}`;
    diagnosticModal.classList.remove('hidden');
  });
});

diagnosticModalClose.forEach((button) => {
  button.addEventListener('click', () => diagnosticModal.classList.add('hidden'));
});
