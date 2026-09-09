import { initPage } from './page-base.js';
import { getSchedule, toggleScheduleItem, createScheduleItem, deleteScheduleItem } from './storage.js';

initPage();

const scheduleListEl = document.getElementById('scheduleList');
const progressBarEl = document.getElementById('scheduleProgressBar');
const progressTextEl = document.getElementById('scheduleProgressText');
const btnNovaMeta = document.getElementById('btnNovaMeta');
const metaModal = document.getElementById('metaModal');
const btnCancelarMeta = document.getElementById('btnCancelarMeta');
const formNovaMeta = document.getElementById('formNovaMeta');

function renderSchedule() {
  const items = getSchedule();
  if (!scheduleListEl) return;

  if (items.length === 0) {
    scheduleListEl.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #6b607d;">
        <p>Nenhuma meta cadastrada no cronograma.</p>
      </div>
    `;
    updateProgress(0, 0);
    return;
  }

  const completedCount = items.filter(i => i.concluido).length;
  updateProgress(completedCount, items.length);

  scheduleListEl.innerHTML = items.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: ${item.concluido ? '#faf8ff' : '#ffffff'}; border: 1px solid ${item.concluido ? 'rgba(124, 58, 237, 0.2)' : 'rgba(0,0,0,0.06)'}; border-radius: 0.85rem; transition: all 0.2s ease;">
      <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
        <input 
          type="checkbox" 
          id="chk-${item.id}" 
          data-id="${item.id}" 
          class="schedule-chk"
          ${item.concluido ? 'checked' : ''} 
          style="width: 20px; height: 20px; cursor: pointer; accent-color: #7c3aed;" 
        />
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #7c3aed; background: #f3f0ff; padding: 2px 8px; border-radius: 6px;">${item.dia}</span>
            <span style="font-size: 0.75rem; color: #6b607d; background: #f4f4f5; padding: 2px 6px; border-radius: 4px;">${item.tipo}</span>
            <span style="font-size: 0.75rem; color: #a1a1aa;">⏱️ ${item.duracao}</span>
          </div>
          <p style="margin: 0.35rem 0 0; font-size: 0.95rem; font-weight: 600; color: ${item.concluido ? '#8e84a8' : '#1f1630'}; text-decoration: ${item.concluido ? 'line-through' : 'none'};">
            ${item.tema}
          </p>
        </div>
      </div>
      <button 
        data-del-id="${item.id}" 
        class="schedule-del-btn"
        title="Remover meta"
        style="background: transparent; border: none; color: #a1a1aa; cursor: pointer; font-size: 1.1rem; padding: 4px 8px; border-radius: 6px; transition: color 0.15s ease;"
      >
        ✕
      </button>
    </div>
  `).join('');

  // Listeners para checkboxes
  scheduleListEl.querySelectorAll('.schedule-chk').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      toggleScheduleItem(id);
      renderSchedule();
    });
  });

  // Listeners para deletar
  scheduleListEl.querySelectorAll('.schedule-del-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-del-id');
      deleteScheduleItem(id);
      renderSchedule();
    });
  });
}

function updateProgress(completed, total) {
  if (!progressBarEl || !progressTextEl) return;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  progressBarEl.style.width = `${pct}%`;
  progressTextEl.textContent = `${completed} de ${total} atividades concluídas (${pct}%)`;
}

// Modal logic
if (btnNovaMeta && metaModal) {
  btnNovaMeta.addEventListener('click', () => {
    metaModal.style.display = 'flex';
  });
}

if (btnCancelarMeta && metaModal) {
  btnCancelarMeta.addEventListener('click', () => {
    metaModal.style.display = 'none';
  });
}

if (formNovaMeta) {
  formNovaMeta.addEventListener('submit', (e) => {
    e.preventDefault();
    const dia = document.getElementById('metaDia').value;
    const tema = document.getElementById('metaTema').value.trim();
    const tipo = document.getElementById('metaTipo').value;
    const duracao = document.getElementById('metaDuracao').value.trim();

    if (!tema) return;

    createScheduleItem({
      id: 'sch-' + Date.now(),
      dia,
      tema,
      tipo,
      duracao: duracao || '50 min',
      concluido: false
    });

    formNovaMeta.reset();
    metaModal.style.display = 'none';
    renderSchedule();
  });
}

document.addEventListener('DOMContentLoaded', renderSchedule);
renderSchedule();
