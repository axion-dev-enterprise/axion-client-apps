import { initProfessorPage } from './base.js';
import { getEssays, updateEssay } from '../storage.js';
import { normalizeSearch, formatDate, safeText } from './utils.js';

const session = initProfessorPage('essays');
if (!session) throw new Error('Acesso negado.');

const essaySearch = document.getElementById('essaySearch');
const filterButtons = document.querySelectorAll('[data-filter]');
const essaysList = document.getElementById('essaysList');
const modal = document.querySelector('[data-prof-correction-modal]');
const modalCloseButtons = document.querySelectorAll('[data-prof-correction-close]');
const profCorrectionForm = document.getElementById('profCorrectionForm');
const profCorrectionPhoto = document.getElementById('profCorrectionPhoto');
const profCorrectionPreview = document.getElementById('profCorrectionPreview');
const profCorrectionAluno = document.getElementById('profCorrectionAluno');
const profCorrectionEmail = document.getElementById('profCorrectionEmail');
const profCorrectionTema = document.getElementById('profCorrectionTema');
const profCorrectionDate = document.getElementById('profCorrectionDate');
const profOriginalImage = document.getElementById('profOriginalImage');
const profDownloadOriginal = document.getElementById('profDownloadOriginal');
const profScore = document.getElementById('profScore');
const profFeedbackText = document.getElementById('profFeedbackText');
const profReopenBtn = document.getElementById('profReopenBtn');
const profSubmitBtn = document.getElementById('profSubmitBtn');

let activeFilter = 'all';
let activeEssayId = null;
let essays = getEssays();

const renderEssayCard = (essay) => {
  const statusLabel = essay.status === 'concluido' ? 'Corrigida' : 'Pendente';
  const notaDisplay = essay.feedback?.nota != null ? `${essay.feedback.nota}/10` : '—';
  return `
    <article class="card-item">
      <div class="activity-meta">
        <strong>${safeText(essay.tema_da_redacao || essay.tema_gerado)}</strong>
        <span>${formatDate(essay.criadoEm)}</span>
      </div>
      <p>Aluno: <strong>${safeText(essay.autor)}</strong></p>
      <p>E-mail: <strong>${safeText(essay.autor)}</strong></p>
      <p>Status: <span class="status-chip ${essay.status}">${statusLabel}</span></p>
      <p>Nota: <strong>${notaDisplay}</strong></p>
      <div class="action-buttons">
        <button type="button" class="btn btn-secondary" data-action="view" data-essay-id="${essay.id}">Visualizar</button>
        <button type="button" class="btn btn-primary" data-action="edit" data-essay-id="${essay.id}">Corrigir</button>
      </div>
    </article>
  `;
};

const renderEssays = () => {
  const searchText = normalizeSearch(essaySearch.value);
  essays = getEssays();
  const filtered = essays.filter((essay) => {
    const text = normalizeSearch(`${essay.tema_da_redacao} ${essay.tema_gerado} ${essay.autor}`);
    const matchesSearch = text.includes(searchText);
    if (!matchesSearch) return false;
    if (activeFilter === 'pendente') return essay.status === 'pendente';
    if (activeFilter === 'concluido') return essay.status === 'concluido';
    return true;
  });

  essaysList.innerHTML = filtered.length ? filtered.map(renderEssayCard).join('') : '<div class="activity-item"><strong>Nenhuma redação encontrada</strong><p>Ajuste seus filtros ou pesquise outros termos.</p></div>';

  essaysList.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const essayId = event.currentTarget.dataset.essayId;
      const action = event.currentTarget.dataset.action;
      const essay = essays.find((item) => item.id === essayId);
      if (!essay) return;
      openCorrectionModal(essay, action === 'view');
    });
  });
};

const resetModal = () => {
  profCorrectionPhoto.value = '';
  profCorrectionPreview.innerHTML = '';
  profScore.value = '';
  profFeedbackText.value = '';
  profOriginalImage.innerHTML = '';
  profDownloadOriginal.href = '#';
  profDownloadOriginal.style.display = 'none';
  profReopenBtn.style.display = 'none';
  profSubmitBtn.disabled = false;
  profSubmitBtn.textContent = 'Enviar correção e concluir';
};

const openCorrectionModal = (essay, isViewOnly = false) => {
  activeEssayId = essay.id;
  resetModal();
  profCorrectionAluno.textContent = safeText(essay.autor);
  profCorrectionEmail.textContent = safeText(essay.autor);
  profCorrectionTema.textContent = safeText(essay.tema_da_redacao || essay.tema_gerado);
  profCorrectionDate.textContent = formatDate(essay.criadoEm);
  profOriginalImage.innerHTML = essay.foto ? `<img src="${essay.foto}" alt="Redação original" />` : 'Sem imagem disponível';
  if (essay.foto) {
    profDownloadOriginal.href = essay.foto;
    profDownloadOriginal.style.display = 'inline-flex';
  }
  profScore.value = essay.feedback?.nota ?? '';
  profFeedbackText.value = essay.feedback?.message || essay.feedback?.messageText || '';
  if (essay.status === 'concluido') {
    profReopenBtn.style.display = 'inline-flex';
  }
  modal.classList.remove('hidden');
};

const updatePreview = (file) => {
  if (!file) {
    profCorrectionPreview.innerHTML = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    profCorrectionPreview.innerHTML = `<img src="${event.target.result}" alt="Foto da correção" />`;
  };
  reader.readAsDataURL(file);
};

profCorrectionPhoto.addEventListener('change', (event) => {
  updatePreview(event.target.files[0]);
});

profCorrectionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!activeEssayId) return;
  if (!window.confirm('Deseja concluir a correção e salvar as alterações?')) return;

  const file = profCorrectionPhoto.files[0];
  const nota = profScore.value;
  const mensagem = profFeedbackText.value.trim();
  const applyUpdate = (fotoData) => {
    profSubmitBtn.disabled = true;
    profSubmitBtn.textContent = 'Enviando...';
    const feedback = { message: mensagem || '', foto: fotoData || '', nota: nota ? Number(nota) : null };
    updateEssay(activeEssayId, { feedback, status: 'concluido', corrigidoEm: new Date().toISOString() });
    setTimeout(() => {
      modal.classList.add('hidden');
      renderEssays();
    }, 300);
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => applyUpdate(event.target.result);
    reader.readAsDataURL(file);
  } else {
    const essay = essays.find((item) => item.id === activeEssayId);
    applyUpdate(essay?.feedback?.foto || '');
  }
});

profReopenBtn.addEventListener('click', () => {
  if (!activeEssayId) return;
  updateEssay(activeEssayId, { status: 'pendente' });
  modal.classList.add('hidden');
  renderEssays();
});

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', () => modal.classList.add('hidden'));
});

essaySearch.addEventListener('input', renderEssays);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderEssays();
  });
});

renderEssays();
