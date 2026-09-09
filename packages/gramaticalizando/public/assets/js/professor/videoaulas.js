import { initProfessorPage } from './base.js';
import { createVideoLesson, deleteVideoLesson, getVideoLessons, saveVideoLessons } from '../storage.js';

const session = initProfessorPage('videoaulas');
if (!session) throw new Error('Acesso negado.');

const modal = document.querySelector('[data-video-modal]');
const modalCloseButtons = document.querySelectorAll('[data-video-close]');
const openLessonModalButtons = document.querySelectorAll('#openLessonModalBtn, [data-open-video-modal]');
const viewLessonsTrigger = document.getElementById('viewLessonsTrigger');
const videoLessonsList = document.getElementById('videoLessonsList');
const videoLessonForm = document.getElementById('videoLessonForm');

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const normalizeLink = (value = '') => {
  const text = String(value).trim();
  if (!text) return '';
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
};

const formatLessonDate = (value) => {
  if (!value) return 'Sem data';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sem data';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const createSeedLessons = () => {
  const seed = [
    {
      id: 'seed-live-1',
      titulo: 'Aula ao vivo: Revisão de português',
      assunto: 'Português',
      tipo: 'ao_vivo',
      link: 'https://meet.google.com/abc-defg-hij',
      data: '2026-08-10T19:00',
      descricao: 'Revisão de gramática, interpretação de texto e ortografia.',
      criadoEm: new Date().toISOString()
    },
    {
      id: 'seed-live-2',
      titulo: 'Aula gravada: Estratégia de redação',
      assunto: 'Redação',
      tipo: 'gravada',
      link: 'https://www.youtube.com/watch?v=example',
      data: '2026-08-08T18:30',
      descricao: 'Aula complementar com dicas sobre coesão e estrutura.',
      criadoEm: new Date().toISOString()
    }
  ];

  saveVideoLessons(seed);
};

const openModal = () => {
  if (!modal) return;
  modal.classList.remove('hidden');
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.add('hidden');
  if (videoLessonForm) {
    videoLessonForm.reset();
  }
};

const renderLessons = () => {
  if (!videoLessonsList) return;

  const lessons = getVideoLessons();

  if (!lessons.length) {
    videoLessonsList.innerHTML = `
      <div class="activity-item">
        <strong>Nenhuma aula cadastrada</strong>
        <p>Use o botão acima para adicionar uma aula ao vivo e enviar o link para os alunos.</p>
      </div>
    `;
    return;
  }

  videoLessonsList.innerHTML = lessons.map((lesson) => {
    const statusText = lesson.tipo === 'ao_vivo' ? 'Ao vivo' : 'Gravada';
    const linkLabel = lesson.link ? 'Abrir link' : 'Sem link';

    return `
      <article class="card-item">
        <div class="activity-meta">
          <strong>${escapeHtml(lesson.titulo || 'Aula sem título')}</strong>
          <span>${escapeHtml(statusText)}</span>
        </div>
        <p><strong>Assunto:</strong> ${escapeHtml(lesson.assunto || '—')}</p>
        <p><strong>Data:</strong> ${escapeHtml(formatLessonDate(lesson.data))}</p>
        <p><strong>Descrição:</strong> ${escapeHtml(lesson.descricao || 'Sem descrição cadastrada.')}</p>
        <div class="action-buttons">
          <a
            class="btn btn-secondary"
            href="${escapeHtml(normalizeLink(lesson.link))}"
            target="_blank"
            rel="noopener noreferrer"
            ${lesson.link ? '' : 'aria-disabled="true" tabindex="-1"'}
          >
            ${linkLabel}
          </a>
          <button type="button" class="btn btn-primary" data-lesson-action="delete" data-lesson-id="${escapeHtml(lesson.id || '')}">Excluir</button>
        </div>
      </article>
    `;
  }).join('');
};

if (videoLessonForm) {
  videoLessonForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(videoLessonForm);
    const titulo = String(formData.get('titulo') || '').trim();
    const link = normalizeLink(formData.get('link'));

    if (!titulo || !link) {
      window.alert('Preencha o título e o link da aula para continuar.');
      return;
    }

    const lesson = {
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `video-${Date.now()}`,
      titulo,
      assunto: String(formData.get('assunto') || '').trim(),
      tipo: String(formData.get('tipo') || 'ao_vivo'),
      data: String(formData.get('data') || ''),
      descricao: String(formData.get('descricao') || '').trim(),
      link,
      criadoEm: new Date().toISOString()
    };

    createVideoLesson(lesson);
    closeModal();
    renderLessons();
  });
}

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', closeModal);
});

openLessonModalButtons.forEach((button) => {
  button.addEventListener('click', openModal);
});

if (viewLessonsTrigger) {
  viewLessonsTrigger.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
}

if (videoLessonsList) {
  videoLessonsList.addEventListener('click', (event) => {
    const target = event.target.closest('[data-lesson-action]');
    if (!target) return;

    const { lessonAction, lessonId } = target.dataset;
    if (lessonAction !== 'delete' || !lessonId) return;

    const shouldDelete = window.confirm('Deseja excluir esta aula da lista?');
    if (!shouldDelete) return;

    deleteVideoLesson(lessonId);
    renderLessons();
  });
}

const existingLessons = getVideoLessons();
if (!existingLessons.length) {
  createSeedLessons();
}

renderLessons();
