import { initPage } from './page-base.js';
import { getContents } from './storage.js';

initPage();

const listEl = document.getElementById('studentContentList');
const countEl = document.getElementById('contentsCount');
const searchInput = document.getElementById('portuguesSearch');
const filterPills = document.querySelectorAll('#moduleFilterPills .filter-pill');

let activeModulo = 'todos';
let searchQuery = '';

const filterContents = () => {
  const allContents = getContents().filter((c) => c.status === 'publicado');
  return allContents.filter((c) => {
    const matchesModulo = activeModulo === 'todos' || (c.tema && c.tema.toLowerCase() === activeModulo.toLowerCase()) || (c.modulo && c.modulo.toLowerCase() === activeModulo.toLowerCase());
    const matchesSearch = !searchQuery || 
      (c.titulo && c.titulo.toLowerCase().includes(searchQuery)) ||
      (c.descricao && c.descricao.toLowerCase().includes(searchQuery)) ||
      (c.tema && c.tema.toLowerCase().includes(searchQuery));
    return matchesModulo && matchesSearch;
  });
};

const renderList = () => {
  if (!listEl) return;
  const filtered = filterContents();
  if (countEl) {
    countEl.textContent = `${filtered.length} aula${filtered.length === 1 ? '' : 's'}`;
  }

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="activity-item" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
        <strong style="font-size: 1.1rem; color: #e2e8f0;">Nenhuma aula encontrada</strong>
        <p style="color: #94a3b8; margin-top: 6px;">Tente ajustar o termo da busca ou selecione outro módulo.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map((c) => `
    <article class="video-lesson-card" style="display:flex; flex-direction:column; justify-content:space-between; background:var(--surface, #1e1b2e); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:1.25rem; transition:transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.2s; box-shadow:0 4px 20px rgba(0,0,0,0.15);">
      <div>
        <div class="video-lesson-header" style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.75rem;">
          <h3 style="font-size:1.05rem; font-weight:700; color:#fff; line-height:1.4; margin:0;">${c.titulo}</h3>
          <span class="video-lesson-badge recorded" style="background:rgba(124,58,237,0.15); color:#c4b5fd; border:1px solid rgba(124,58,237,0.3); font-size:0.75rem; padding:3px 8px; border-radius:6px; white-space:nowrap;">${c.tema || 'Português'}</span>
        </div>
        <p style="font-size:0.875rem; color:#94a3b8; line-height:1.5; margin:0 0 1rem;">${c.descricao || ''}</p>
      </div>
      <div>
        <div class="video-lesson-meta" style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:#64748b; margin-bottom:1rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.75rem;">
          <span>📚 ${c.blocos?.length || 2} seções</span>
          <span style="font-weight:600; color:${c.nivel === 'Avançado' ? '#f59e0b' : c.nivel === 'Médio' ? '#38bdf8' : '#34d399'};">🎯 ${c.nivel || 'Iniciante'}</span>
        </div>
        <div class="video-lesson-actions">
          <a href="/portugues-conteudo?id=${encodeURIComponent(c.id)}" class="btn btn-primary" style="display:flex; align-items:center; justify-content:center; gap:6px; width:100%; text-decoration:none; padding:0.6rem; border-radius:8px; font-size:0.875rem; font-weight:600;">
            <span>Estudar aula</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
      </div>
    </article>
  `).join('');
};

// Listeners de filtro
filterPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    filterPills.forEach((p) => {
      p.classList.remove('active');
      p.style.background = 'rgba(255,255,255,0.04)';
      p.style.color = '#cbd5e1';
      p.style.borderColor = 'rgba(255,255,255,0.1)';
    });
    pill.classList.add('active');
    pill.style.background = '#7c3aed';
    pill.style.color = '#ffffff';
    pill.style.borderColor = 'rgba(124,58,237,0.4)';
    activeModulo = pill.dataset.modulo || 'todos';
    renderList();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = String(e.target.value || '').trim().toLowerCase();
    renderList();
  });
}

renderList();
