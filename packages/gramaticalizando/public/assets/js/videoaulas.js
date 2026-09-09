import { initPage } from './page-base.js';
import { getVideoLessons } from './storage.js';

initPage();

const listElement = document.getElementById('videoLessonsList');
const countElement = document.getElementById('videoLessonsCount');

const normalizeLink = (value = '') => {
  const text = String(value).trim();
  if (!text) return '#';
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
};

const formatLessonDate = (value) => {
  if (!value) return 'Data a definir';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data a definir';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const renderLessons = () => {
  if (!listElement) return;

  const lessons = getVideoLessons();

  if (!lessons.length) {
    countElement.textContent = '0';
    listElement.innerHTML = `
      <div class="video-empty">
        Nenhuma aula disponível no momento. O professor pode publicar uma nova aula ao vivo ou gravada aqui.
      </div>
    `;
    return;
  }

  countElement.textContent = String(lessons.length);

  listElement.innerHTML = lessons.map((lesson) => {
    const type = lesson.tipo === 'ao_vivo' ? 'live' : 'recorded';
    const typeLabel = lesson.tipo === 'ao_vivo' ? 'Ao vivo' : 'Gravada';
    const href = normalizeLink(lesson.link);

    return `
      <article class="video-lesson-card">
        <div class="video-lesson-header">
          <h3>${lesson.titulo || 'Aula sem título'}</h3>
          <span class="video-lesson-badge ${type}">${typeLabel}</span>
        </div>

        <p class="video-lesson-subject"><strong>Assunto:</strong> ${lesson.assunto || 'Geral'}</p>
        <p class="video-lesson-description">${lesson.descricao || 'Aula disponível para revisão e acompanhamento do conteúdo.'}</p>

        <div class="video-lesson-meta">
          <span>📅 ${formatLessonDate(lesson.data)}</span>
          <span>🎯 ${lesson.dificuldade || 'Nível geral'}</span>
        </div>

        <div class="video-lesson-actions">
          <a
            class="btn btn-primary"
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${lesson.link ? 'Acessar aula' : 'Link indisponível'}
          </a>
        </div>
      </article>
    `;
  }).join('');
};

renderLessons();
