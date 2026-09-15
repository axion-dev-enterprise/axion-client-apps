import { initPage } from './page-base.js';
import { getContents, getSession, markPortugueseContentCompleted } from './storage.js';

initPage();

const params = new URLSearchParams(window.location.search);
const contentId = params.get('id');

const studyHeader = document.getElementById('studyHeader');
const studyBlocks = document.getElementById('studyBlocks');
const studyTimeValue = document.getElementById('studyTimeValue');
const studyBlocksCount = document.getElementById('studyBlocksCount');
const studyFocusLabel = document.getElementById('studyFocusLabel');
const studyNextTopics = document.getElementById('studyNextTopics');
const backButton = document.querySelector('[data-back-button]');

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const normalizeText = (value = '') => String(value).trim();

const parseQuestionAlternatives = (value = '') => {
  const rawLines = Array.isArray(value)
    ? value.map((item) => (typeof item === 'string' ? item : String(item?.texto || '')).trim()).filter(Boolean)
    : String(value || '')
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);

  return rawLines.map((line, index) => {
    const match = line.match(/^([A-Da-d])([\)\.:\-]?\s*)(.+)$/);
    const normalizedId = match ? match[1].trim().toLowerCase() : String.fromCharCode(97 + index);
    const normalizedText = match ? match[3].trim() : line;

    return {
      id: normalizedId,
      texto: normalizedText
    };
  });
};

const selectedAnswers = new Map();
const completedQuestions = new Set();

const defaultContent = {
  id: '',
  titulo: 'Conteúdo em estudo',
  tema: 'Português',
  nivel: 'Médio',
  descricao: 'Revise os conteúdos e responda ao desafio.',
  blocos: []
};

const getCurrentContent = () => {
  const contents = getContents().filter((c) => c.status === 'publicado');
  return contents.find((c) => c.id === contentId) || { ...defaultContent, ...contents[0] };
};

const buildBlocks = (content) => {
  const blocks = Array.isArray(content.blocos) ? content.blocos : [];
  const questionBlocks = blocks.filter((block) => block.tipo === 'questao');
  studyBlocksCount.textContent = String(questionBlocks.length || blocks.length);
  studyFocusLabel.textContent = content.tema || 'Português';

  studyBlocks.innerHTML = blocks.map((block, index) => {
    const title = escapeHtml(block.titulo || `Bloco ${index + 1}`);
    if (block.tipo === 'texto') {
      return `
        <section class="panel-card study-block-card">
          <div class="study-block-header">
            <span class="study-block-tag">Explicação</span>
            <h3>${title}</h3>
          </div>
          <div class="study-block-body">${escapeHtml(block.conteudo || '').replace(/\n/g, '<br>')}</div>
        </section>
      `;
    }

    if (block.tipo === 'questao') {
      const alternatives = parseQuestionAlternatives(block.alternativas);
      const questionId = String(block.id || `question-${index}`);
      const selectedValue = selectedAnswers.get(questionId) || '';

      return `
        <section class="study-question-panel">
          <div class="study-question-header">
            <div>
              <span class="study-block-tag">Questão</span>
              <h2>Questão ${index + 1} de ${blocks.length}</h2>
            </div>
            <span class="study-question-counter">${index + 1}/${blocks.length}</span>
          </div>
          <div class="study-question-body">
            <div class="study-question-copy">
              <p class="study-question-label">${escapeHtml(content.tema || 'Português')}</p>
              <h3>${escapeHtml(block.conteudo || '').replace(/\n/g, '<br>')}</h3>
            </div>
            <div class="study-options">
              ${alternatives.map((alternative) => `
                <button
                  type="button"
                  class="study-option ${selectedValue === alternative.id ? 'is-selected' : ''}"
                  data-question-id="${escapeHtml(questionId)}"
                  data-option-index="${escapeHtml(alternative.id)}"
                  aria-pressed="${selectedValue === alternative.id ? 'true' : 'false'}"
                >
                  <span class="study-option-letter">${escapeHtml(alternative.id.toUpperCase())}</span>
                  <span>${escapeHtml(alternative.texto)}</span>
                </button>
              `).join('')}
            </div>
            <div class="study-answer-actions">
              <button type="button" class="btn btn-primary study-confirm-answer" data-question-id="${escapeHtml(questionId)}" data-confirm-answer>Confirmar resposta</button>
              <button type="button" class="btn btn-secondary study-save-answer" data-question-id="${escapeHtml(questionId)}" data-save-answer>Salvar para revisar</button>
            </div>
          </div>
        </section>
      `;
    }

    if (block.tipo === 'imagem' && (block.imagem || block.url || block.src)) {
      return `
        <section class="panel-card study-block-card">
          <div class="study-block-header">
            <span class="study-block-tag">Imagem</span>
            <h3>${title}</h3>
          </div>
          <img class="study-block-image" src="${escapeHtml(block.imagem || block.url || block.src)}" alt="${escapeHtml(block.nome || block.titulo || 'Imagem do conteúdo')}" />
        </section>
      `;
    }

    if (block.tipo === 'pdf' && block.pdf) {
      return `
        <section class="panel-card study-block-card">
          <div class="study-block-header">
            <span class="study-block-tag">Material</span>
            <h3>${title}</h3>
          </div>
          <a class="btn btn-secondary study-inline-link" href="${escapeHtml(block.pdf)}" target="_blank" rel="noopener noreferrer">Abrir PDF: ${escapeHtml(block.nome || 'arquivo')}</a>
        </section>
      `;
    }

    if (block.tipo === 'video' && block.link) {
      return `
        <section class="panel-card study-block-card">
          <div class="study-block-header">
            <span class="study-block-tag">Vídeo</span>
            <h3>${title}</h3>
          </div>
          <a class="btn btn-secondary study-inline-link" href="${escapeHtml(block.link)}" target="_blank" rel="noopener noreferrer">Assistir vídeo</a>
        </section>
      `;
    }

    if (block.tipo === 'link' && block.link) {
      return `
        <section class="panel-card study-block-card">
          <div class="study-block-header">
            <span class="study-block-tag">Link</span>
            <h3>${title}</h3>
          </div>
          <a class="btn btn-secondary study-inline-link" href="${escapeHtml(block.link)}" target="_blank" rel="noopener noreferrer">Abrir link</a>
        </section>
      `;
    }

    return '';
  }).join('');
};

const renderNextTopics = (content) => {
  const topics = [
    'Leitura e interpretação',
    'Gramática aplicada',
    'Produção textual',
    'Revisão de conceitos'
  ].filter((topic) => topic !== (content.tema || 'Português'));

  studyNextTopics.innerHTML = topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('');
};

const renderHeader = (content) => {
  const session = getSession();
  const userName = session?.nome ? session.nome.split(' ')[0] : 'aluno';

  studyHeader.innerHTML = `
    <div class="study-header-top">
      <div>
        <p class="dashboard-title">Conteúdo de ${escapeHtml(content.tema || 'Português')}</p>
        <h1>${escapeHtml(content.titulo || 'Conteúdo em estudo')}</h1>
      </div>
      <div class="study-user-pill">Olá, ${escapeHtml(userName)}</div>
    </div>
    <div class="study-header-meta">
      <span>${escapeHtml(content.nivel || 'Médio')}</span>
      <span>${(content.blocos || []).length} blocos</span>
      <span>${escapeHtml(content.descricao || 'Conteúdo do módulo')}</span>
    </div>
  `;
};

const markCurrentContentAsCompleted = () => {
  const currentSession = getSession();
  if (!currentSession || (currentSession.tipo !== 'aluno' && currentSession.tipo !== 'cliente')) {
    return;
  }

  const content = getCurrentContent();
  if (!content || !content.id) return;

  markPortugueseContentCompleted(currentSession.id || currentSession.email, content.id, content);
};

const renderContent = () => {
  const content = getCurrentContent();

  if (!content || !content.id) {
    studyHeader.innerHTML = `
      <div class="study-header-top">
        <div>
          <p class="dashboard-title">Português</p>
          <h1>Conteúdo ainda não publicado</h1>
        </div>
      </div>
    `;
    studyBlocks.innerHTML = '<div class="panel-card"><p>Nenhum conteúdo publicado foi encontrado.</p></div>';
    return;
  }

  renderHeader(content);
  buildBlocks(content);
  renderNextTopics(content);
};

backButton?.addEventListener('click', () => {
  window.location.href = '/pages/portugues.html';
});

studyBlocks?.addEventListener('click', (event) => {
  const optionButton = event.target.closest('[data-option-index]');
  if (optionButton) {
    const questionId = optionButton.dataset.questionId;
    selectedAnswers.set(questionId, optionButton.dataset.optionIndex);

    optionButton.closest('.study-options')?.querySelectorAll('.study-option').forEach((button) => {
      const isSelected = button.dataset.optionIndex === optionButton.dataset.optionIndex && button.dataset.questionId === questionId;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
    return;
  }

  const confirmButton = event.target.closest('[data-confirm-answer]');
  if (confirmButton) {
    const questionId = confirmButton.dataset.questionId;
    completedQuestions.add(questionId);
    confirmButton.textContent = 'Resposta salva';
    confirmButton.classList.add('is-confirmed');
    markCurrentContentAsCompleted();
    return;
  }

  const saveButton = event.target.closest('[data-save-answer]');
  if (saveButton) {
    const questionId = saveButton.dataset.questionId;
    completedQuestions.add(questionId);
    saveButton.textContent = 'Salvo';
    markCurrentContentAsCompleted();
  }
});

renderContent();
