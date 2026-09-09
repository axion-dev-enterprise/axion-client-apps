import { initProfessorPage } from './base.js';
import { getEssays, updateEssay, getSession } from '../storage.js';
import { formatDate, safeText } from './utils.js';

const session = initProfessorPage('corrections');
if (!session) throw new Error('Acesso negado.');

const correctionsList = document.getElementById('correctionsList');
const essays = getEssays().filter((essay) => essay.status === 'concluido');

if (!essays.length) {
  correctionsList.innerHTML = '<div class="activity-item"><strong>Nenhuma correção realizada</strong><p>Ainda não há redações marcadas como corrigidas.</p></div>';
} else {
  correctionsList.innerHTML = essays.map((essay) => {
    return `
      <article class="card-item">
        <div class="activity-meta">
          <strong>${safeText(essay.tema_da_redacao || essay.tema_gerado)}</strong>
          <span>${formatDate(essay.corrigidoEm || essay.criadoEm)}</span>
        </div>
        <p>Aluno: <strong>${safeText(essay.autor)}</strong></p>
        <p>Nota: <strong>${essay.feedback?.nota != null ? `${essay.feedback.nota}/10` : '—'}</strong></p>
        <p>Professor: <strong>${safeText(session.nome)}</strong></p>
        <p>Status: <span class="status-chip concluido">Corrigido</span></p>
        <div class="action-buttons">
          <button type="button" class="btn btn-primary" data-view-correction="${essay.id}">Ver correção</button>
        </div>
      </article>
    `;
  }).join('');
}

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

let activeEssayId = null;

const openCorrectionModal = (essay) => {
  activeEssayId = essay.id;
  profCorrectionPhoto.value = '';
  profCorrectionPreview.innerHTML = '';
  profCorrectionAluno.textContent = safeText(essay.autor);
  profCorrectionEmail.textContent = safeText(essay.autor);
  profCorrectionTema.textContent = safeText(essay.tema_da_redacao || essay.tema_gerado);
  profCorrectionDate.textContent = formatDate(essay.criadoEm);
  profOriginalImage.innerHTML = essay.foto ? `<img src="${essay.foto}" alt="Redação original" />` : 'Sem imagem disponível';
  profDownloadOriginal.href = essay.foto || '#';
  profDownloadOriginal.style.display = essay.foto ? 'inline-flex' : 'none';
  profScore.value = essay.feedback?.nota ?? '';
  profFeedbackText.value = essay.feedback?.message || essay.feedback?.messageText || '';
  profReopenBtn.style.display = 'inline-flex';
  profSubmitBtn.disabled = false;
  profSubmitBtn.textContent = 'Enviar correção e concluir';
  modal.classList.remove('hidden');
};

if (correctionsList) {
  correctionsList.querySelectorAll('[data-view-correction]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const essayId = event.currentTarget.dataset.viewCorrection;
      const essay = essays.find((item) => item.id === essayId);
      if (!essay) return;
      openCorrectionModal(essay);
    });
  });
}

if (profCorrectionPhoto) {
  profCorrectionPhoto.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
      profCorrectionPreview.innerHTML = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      profCorrectionPreview.innerHTML = `<img src="${e.target.result}" alt="Foto da correção" />`;
    };
    reader.readAsDataURL(file);
  });
}

if (profCorrectionForm) {
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
        window.location.reload();
      }, 250);
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => applyUpdate(e.target.result);
      reader.readAsDataURL(file);
    } else {
      const essay = essays.find((item) => item.id === activeEssayId);
      applyUpdate(essay?.feedback?.foto || '');
    }
  });
}

if (profReopenBtn) {
  profReopenBtn.addEventListener('click', () => {
    if (!activeEssayId) return;
    updateEssay(activeEssayId, { status: 'pendente' });
    modal.classList.add('hidden');
    window.location.reload();
  });
}

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', () => modal.classList.add('hidden'));
});
