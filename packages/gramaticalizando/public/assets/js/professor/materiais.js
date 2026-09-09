import { initProfessorPage } from './base.js';
import { getMaterials, createMaterial, deleteMaterial } from '../storage.js';

initProfessorPage('materiais');

const materialsContainer = document.getElementById('professorMaterialsList');
const formAdd = document.getElementById('formAddMaterial');

function renderProfessorMaterials() {
  if (!materialsContainer) return;
  const materials = getMaterials();

  if (materials.length === 0) {
    materialsContainer.innerHTML = '<div class="activity-item">Nenhum material cadastrado.</div>';
    return;
  }

  materialsContainer.innerHTML = materials.map(mat => `
    <article class="activity-item" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="video-lesson-badge recorded">${mat.categoria}</span>
          <span style="font-size: 0.8rem; color: #7c3aed; font-weight: 700;">${mat.formato} (${mat.tamanho})</span>
        </div>
        <strong style="display: block; margin-top: 4px; font-size: 1rem;">${mat.titulo}</strong>
        <p style="margin: 2px 0 0; font-size: 0.85rem; color: #6b607d;">${mat.descricao}</p>
      </div>
      <button 
        data-del-id="${mat.id}" 
        class="btn-del-mat"
        style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;"
      >
        Excluir
      </button>
    </article>
  `).join('');

  materialsContainer.querySelectorAll('.btn-del-mat').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-del-id');
      deleteMaterial(id);
      renderProfessorMaterials();
    });
  });
}

if (formAdd) {
  formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('matTitulo').value.trim();
    const categoria = document.getElementById('matCategoria').value;
    const descricao = document.getElementById('matDescricao').value.trim();
    const formato = document.getElementById('matFormato').value;
    const tamanho = document.getElementById('matTamanho').value.trim();

    if (!titulo) return;

    createMaterial({
      id: 'mat-' + Date.now(),
      titulo,
      categoria,
      descricao: descricao || 'Material didático disponibilizado pelo professor.',
      formato: formato || 'PDF',
      tamanho: tamanho || '1.5 MB',
      data: new Date().toLocaleDateString('pt-BR'),
      link: '#'
    });

    formAdd.reset();
    renderProfessorMaterials();
  });
}

document.addEventListener('DOMContentLoaded', renderProfessorMaterials);
renderProfessorMaterials();
