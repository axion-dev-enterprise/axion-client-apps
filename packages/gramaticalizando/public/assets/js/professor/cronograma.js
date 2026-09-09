import { initProfessorPage } from './base.js';
import { getSchedule, createScheduleItem, deleteScheduleItem } from '../storage.js';

initProfessorPage('cronograma');

const scheduleContainer = document.getElementById('professorScheduleList');
const formAdd = document.getElementById('formAddSchedule');

function renderProfessorSchedule() {
  if (!scheduleContainer) return;
  const items = getSchedule();
  
  if (items.length === 0) {
    scheduleContainer.innerHTML = '<div class="activity-item">Nenhum bloco de cronograma configurado.</div>';
    return;
  }

  scheduleContainer.innerHTML = items.map(item => `
    <article class="activity-item" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="video-lesson-badge recorded">${item.dia}</span>
          <span style="font-size: 0.8rem; color: #7c3aed; font-weight: 700;">${item.tipo}</span>
          <span style="font-size: 0.8rem; color: #a1a1aa;">⏱️ ${item.duracao}</span>
        </div>
        <strong style="display: block; margin-top: 4px; font-size: 1rem;">${item.tema}</strong>
      </div>
      <button 
        data-del-id="${item.id}" 
        class="btn-del-item"
        style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;"
      >
        Excluir
      </button>
    </article>
  `).join('');

  scheduleContainer.querySelectorAll('.btn-del-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-del-id');
      deleteScheduleItem(id);
      renderProfessorSchedule();
    });
  });
}

if (formAdd) {
  formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    const dia = document.getElementById('schDia').value;
    const tema = document.getElementById('schTema').value.trim();
    const tipo = document.getElementById('schTipo').value;
    const duracao = document.getElementById('schDuracao').value.trim();

    if (!tema) return;

    createScheduleItem({
      id: 'sch-' + Date.now(),
      dia,
      tema,
      tipo,
      duracao: duracao || '50 min',
      concluido: false
    });

    formAdd.reset();
    renderProfessorSchedule();
  });
}

document.addEventListener('DOMContentLoaded', renderProfessorSchedule);
renderProfessorSchedule();
