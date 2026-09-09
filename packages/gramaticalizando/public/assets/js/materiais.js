import { initPage } from './page-base.js';
import { getMaterials } from './storage.js';

initPage();

const materialsListEl = document.getElementById('materialsList');
const filterButtons = document.querySelectorAll('#materialFilterButtons .filter-btn');

let currentFilter = 'todos';

function renderMaterials() {
  if (!materialsListEl) return;
  const materials = getMaterials();
  const filtered = currentFilter === 'todos' 
    ? materials 
    : materials.filter(m => m.categoria === currentFilter);

  if (filtered.length === 0) {
    materialsListEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: #fff; border-radius: 1rem; border: 1px solid #e8e0f0;">
        <p style="color: #6b607d; margin: 0;">Nenhum material encontrado para esta categoria.</p>
      </div>
    `;
    return;
  }

  materialsListEl.innerHTML = filtered.map(mat => `
    <article class="dashboard-card" style="background: #ffffff; border: 1px solid rgba(124, 58, 237, 0.12); border-radius: 1.25rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.04); transition: transform 0.2s ease, box-shadow 0.2s ease;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
          <span style="font-size: 0.75rem; font-weight: 700; color: #7c3aed; background: #f3f0ff; padding: 3px 10px; border-radius: 999px;">
            ${mat.categoria}
          </span>
          <span style="font-size: 0.75rem; color: #a1a1aa; font-weight: 600;">
            ${mat.formato} • ${mat.tamanho}
          </span>
        </div>
        <h3 style="margin: 0 0 0.5rem; font-size: 1.05rem; color: #1f1630; line-height: 1.35;">
          ${mat.titulo}
        </h3>
        <p style="margin: 0; font-size: 0.85rem; color: #6b607d; line-height: 1.5;">
          ${mat.descricao}
        </p>
      </div>

      <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #f3f0ff; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.75rem; color: #a1a1aa;">Atualizado: ${mat.data}</span>
        <button 
          type="button"
          data-download-id="${mat.id}"
          class="btn-download"
          style="background: #7c3aed; color: #ffffff; border: none; padding: 0.5rem 1rem; border-radius: 0.65rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s ease;"
        >
          <span>Baixar</span>
          <span style="font-size: 0.9rem;">↓</span>
        </button>
      </div>
    </article>
  `).join('');

  materialsListEl.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-download-id');
      const mat = materials.find(m => m.id === id);
      if (mat) {
        // Feedback elegante de download
        const originalText = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = `<span>Baixando...</span>`;
        setTimeout(() => {
          e.currentTarget.innerHTML = `<span>Baixado ✓</span>`;
          setTimeout(() => {
            e.currentTarget.innerHTML = originalText;
          }, 2000);
        }, 800);
      }
    });
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.style.background = '#ffffff';
      b.style.color = '#6b607d';
      b.style.borderColor = '#e2d9f3';
    });
    btn.style.background = '#7c3aed';
    btn.style.color = '#ffffff';
    btn.style.borderColor = '#7c3aed';
    currentFilter = btn.getAttribute('data-cat');
    renderMaterials();
  });
});

document.addEventListener('DOMContentLoaded', renderMaterials);
renderMaterials();
