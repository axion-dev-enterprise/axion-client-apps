import { initProfessorPage } from './base.js';
import { createContent, getContents, updateContent } from '../storage.js';

const session = initProfessorPage('portugues');
if (!session) throw new Error('Acesso negado.');

const form = document.getElementById('contentForm');
const blocksList = document.getElementById('blocksList');
const emptyBlocks = document.getElementById('emptyBlocks');
const contentTypeField = document.getElementById('contentType');
const params = new URLSearchParams(window.location.search);
const editingId = params.get('id');
const MAX_FILE_SIZE = 20 * 1024 * 1024;
let blocks = [];

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const newBlock = (tipo = 'texto') => ({ id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, tipo, titulo: '', conteudo: '', link: '', pdf: '', imagem: '', nome: '', alternativas: '', respostaCorreta: 'a' });

const normalizeQuestionAlternativesList = (value = '') => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : String(item?.texto || '')).trim())
      .filter(Boolean);
  }

  return String(value || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const normalizeQuestionAlternatives = (value = '') => normalizeQuestionAlternativesList(value).join('\n');

const getQuestionOptionLetter = (index) => String.fromCharCode(65 + index);

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => resolve(reader.result));
  reader.addEventListener('error', () => reject(new Error('Não foi possível ler o arquivo.')));
  reader.readAsDataURL(file);
});

const renderBlocks = () => {
  emptyBlocks.classList.toggle('hidden', blocks.length > 0);
  blocksList.innerHTML = blocks.map((block, index) => {
    const isText = block.tipo === 'texto';
    const isQuestion = block.tipo === 'questao';
    const isPdf = block.tipo === 'pdf';
    const isImage = block.tipo === 'imagem';
    const isFile = isPdf || isImage;
    const label = isText ? 'Conteúdo da explicação' : isQuestion ? 'Enunciado da questão' : isFile ? `Upload de ${isPdf ? 'PDF' : 'imagem'}` : block.tipo === 'video' ? 'Endereço do vídeo' : 'Endereço do link';
    const value = isText || isQuestion ? block.conteudo : isPdf ? block.pdf : isImage ? block.imagem : block.link;
    const accept = isPdf ? '.pdf,application/pdf' : 'image/*';
    const hasImage = Boolean(block.imagem);
    const fileName = block.nome || ((isPdf && block.pdf) || (isImage && block.imagem) ? 'Arquivo carregado' : 'Nenhum arquivo selecionado');
    const fileField = isPdf ? 'pdf' : 'imagem';
    const questionAlternatives = normalizeQuestionAlternativesList(block.alternativas);
    const renderedAlternatives = questionAlternatives.length ? questionAlternatives : ['Alternativa 1', 'Alternativa 2', 'Alternativa 3', 'Alternativa 4'];
    const questionOptionsMarkup = renderedAlternatives.map((alternative, optionIndex) => {
      const letter = getQuestionOptionLetter(optionIndex);
      return `
        <div class="question-option-row">
          <span class="question-option-letter">${letter}</span>
          <input type="text" data-field="alternativa" data-alt-index="${optionIndex}" value="${escapeHtml(alternative)}" placeholder="Alternativa ${optionIndex + 1}">
          <button type="button" class="btn-icon" data-remove-alternative data-alt-index="${optionIndex}" aria-label="Remover alternativa">🗑️</button>
        </div>
      `;
    }).join('');
    const questionImageMarkup = isQuestion ? `
      <div class="question-editor-layout">
        <div class="question-editor-main">
          <div class="input-group">
            <label>Enunciado da questão</label>
            <textarea data-field="conteudo" class="textarea-large" rows="6" placeholder="Escreva o enunciado da questão.">${escapeHtml(value)}</textarea>
          </div>
          <div class="input-group">
            <label>Alternativas</label>
            <div class="question-options-list">${questionOptionsMarkup}</div>
            <div class="question-options-actions">
              <button type="button" class="btn btn-secondary btn-inline" data-add-alternative>+ Adicionar alternativa</button>
              <label class="switch-inline">
                <input type="checkbox">
                <span>Embaralhar alternativas</span>
              </label>
            </div>
          </div>
          <div class="input-group">
            <label>Alternativa correta</label>
            <select data-field="respostaCorreta">
              ${renderedAlternatives.map((_, optionIndex) => {
                const letter = getQuestionOptionLetter(optionIndex);
                const valueLabel = letter.toLowerCase();
                return `<option value="${valueLabel}" ${String(block.respostaCorreta || '').toLowerCase() === valueLabel ? 'selected' : ''}>${letter}</option>`;
              }).join('')}
            </select>
          </div>
        </div>
        <div class="question-editor-side">
          <div class="question-upload-card">
            <div class="question-upload-header">
              <span class="question-upload-icon">🖼️</span>
              <label class="question-upload-button">
                <input data-field="imagem" type="file" accept="image/*">
                <span>${hasImage ? 'Trocar imagem' : 'Selecionar imagem'}</span>
              </label>
            </div>
            <div class="question-upload-preview">
              ${block.imagem ? `<img class="content-block-image block-image-preview" src="${escapeHtml(block.imagem)}" alt="${escapeHtml(block.nome || block.titulo || 'Prévia da imagem')}">` : '<div class="question-upload-empty">Clique para enviar imagem<br><small>PNG, JPG ou WEBP</small></div>'}
            </div>
            <small class="field-help">${escapeHtml(fileName)}. Limite de 20 MB.</small>
          </div>
        </div>
      </div>
    ` : '';
    const fileInput = `<input data-field="${fileField}" type="file" accept="${accept}"><small class="field-help">${escapeHtml(fileName)}. Limite de 20 MB.</small>${isImage && value ? `<img class="content-block-image block-image-preview" src="${escapeHtml(value)}" alt="${escapeHtml(block.nome || block.titulo || 'Prévia da imagem')}">` : ''}`;
    const questionMarkup = isQuestion ? questionImageMarkup : '';

    return `<article class="block-field-card" data-block-id="${escapeHtml(block.id)}">
      <div class="block-editor-header"><div><h3>Bloco ${index + 1}</h3><p>Escolha o formato e preencha as informações.</p></div><button type="button" class="btn btn-secondary" data-remove-block>Remover</button></div>
      <div class="block-setup-grid"><div class="input-group"><label>Título do bloco</label><input type="text" data-field="titulo" maxlength="120" value="${escapeHtml(block.titulo)}" placeholder="Ex.: Regra principal"></div><div class="input-group"><label>Tipo</label><select data-field="tipo"><option value="texto" ${block.tipo === 'texto' ? 'selected' : ''}>Texto</option><option value="questao" ${block.tipo === 'questao' ? 'selected' : ''}>Questão</option><option value="imagem" ${block.tipo === 'imagem' ? 'selected' : ''}>Imagem</option><option value="video" ${block.tipo === 'video' ? 'selected' : ''}>Vídeo</option><option value="pdf" ${block.tipo === 'pdf' ? 'selected' : ''}>PDF enviado</option><option value="link" ${block.tipo === 'link' ? 'selected' : ''}>Link</option></select></div></div>
      ${isText ? `<div class="input-group"><label>${label}</label><textarea data-field="conteudo" class="textarea-large" rows="6" placeholder="Escreva a explicação, exemplos e orientações.">${escapeHtml(value)}</textarea></div>` : isQuestion ? '' : isFile ? `<div class="input-group"><label>${label}</label>${fileInput}</div>` : `<div class="input-group"><label>${label}</label><input data-field="link" type="url" value="${escapeHtml(value)}" placeholder="https://..."><small class="field-help">Cole um endereço público para o aluno acessar.</small></div>`}
      ${isQuestion ? questionMarkup : ''}
      ${isFile ? `<div class="input-group"><label>${isImage ? 'Texto alternativo' : 'Nome exibido do arquivo'}</label><input type="text" data-field="nome" value="${escapeHtml(block.nome)}" placeholder="Ex.: ${isImage ? 'Ilustração da regra' : 'Apostila de revisão'}"></div>` : ''}
    </article>`;
  }).join('');
  document.getElementById('summaryBlocks').textContent = String(blocks.length);
};

const syncBlock = (card, field) => {
  const block = blocks.find((item) => item.id === card.dataset.blockId);
  if (!block) return;

  if (field.dataset.field === 'alternativa') {
    const alternatives = normalizeQuestionAlternativesList(block.alternativas);
    const optionIndex = Number(field.dataset.altIndex ?? 0);
    alternatives[optionIndex] = field.value;
    block.alternativas = alternatives;
    return;
  }

  block[field.dataset.field] = field.value;
};

blocksList.addEventListener('input', (event) => {
  const field = event.target.closest('[data-field]');
  if (field && field.type !== 'file') syncBlock(field.closest('[data-block-id]'), field);
});

blocksList.addEventListener('change', (event) => {
  const field = event.target.closest('[data-field]');
  if (!field) return;
  const card = field.closest('[data-block-id]');
  syncBlock(card, field);
  if (field.dataset.field === 'tipo') renderBlocks();
});

blocksList.addEventListener('change', async (event) => {
  const field = event.target.closest('[data-field="pdf"], [data-field="imagem"]');
  if (!field || !field.files[0]) return;
  const block = blocks.find((item) => item.id === field.closest('[data-block-id]').dataset.blockId);
  const file = field.files[0];
  const isPdf = field.dataset.field === 'pdf';
  const validType = isPdf ? file.type === 'application/pdf' : file.type.startsWith('image/');
  if (!validType) {
    window.alert(`Selecione ${isPdf ? 'um arquivo PDF' : 'uma imagem'} válido.`);
    field.value = '';
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    window.alert('O arquivo deve ter no máximo 20 MB.');
    field.value = '';
    return;
  }
  try {
    block[field.dataset.field] = await readFileAsDataUrl(file);
    block.nome = block.nome || file.name;
    renderBlocks();
  } catch (error) {
    window.alert(error.message);
  }
});

blocksList.addEventListener('click', (event) => {
  const blockCard = event.target.closest('[data-block-id]');
  if (!blockCard) return;

  const removeButton = event.target.closest('[data-remove-block]');
  if (removeButton) {
    blocks = blocks.filter((block) => block.id !== blockCard.dataset.blockId);
    renderBlocks();
    return;
  }

  const addAlternativeButton = event.target.closest('[data-add-alternative]');
  if (addAlternativeButton) {
    const block = blocks.find((item) => item.id === blockCard.dataset.blockId);
    if (!block) return;
    const alternatives = normalizeQuestionAlternativesList(block.alternativas);
    alternatives.push(`Alternativa ${alternatives.length + 1}`);
    block.alternativas = alternatives;
    renderBlocks();
    return;
  }

  const removeAlternativeButton = event.target.closest('[data-remove-alternative]');
  if (removeAlternativeButton) {
    const block = blocks.find((item) => item.id === blockCard.dataset.blockId);
    if (!block) return;
    const alternatives = normalizeQuestionAlternativesList(block.alternativas);
    const optionIndex = Number(removeAlternativeButton.dataset.altIndex ?? 0);
    alternatives.splice(optionIndex, 1);
    block.alternativas = alternatives.length ? alternatives : ['Alternativa 1'];
    renderBlocks();
  }
});

document.getElementById('addBlockBtn').addEventListener('click', () => {
  blocks.push(newBlock());
  renderBlocks();
  blocksList.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

['contentTitle', 'contentTheme'].forEach((id) => document.getElementById(id).addEventListener('input', () => {
  document.getElementById(id === 'contentTitle' ? 'summaryTitle' : 'summaryTheme').textContent = document.getElementById(id).value.trim() || (id === 'contentTitle' ? 'Sem título' : 'Sem tema');
}));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const titulo = String(data.get('titulo') || '').trim();
  const tema = String(data.get('tema') || '').trim();
  const tipo = String(data.get('tipo') || 'aula');
  const status = String(event.submitter?.value || 'rascunho');
  if (!titulo || !tema) return window.alert('Preencha o título e o tema do conteúdo.');
  if (!blocks.length) return window.alert('Adicione pelo menos um bloco ao conteúdo.');
  if (blocks.some((block) => {
    if (!block.titulo.trim()) return true;
    if (block.tipo === 'texto') return !block.conteudo.trim();
    if (block.tipo === 'questao') {
      const alternatives = normalizeQuestionAlternativesList(block.alternativas);
      return !block.conteudo.trim() || alternatives.length === 0 || !String(block.respostaCorreta || '').trim();
    }
    if (block.tipo === 'imagem') return !block.imagem;
    if (block.tipo === 'pdf') return !block.pdf;
    return !(block.link || '').trim();
  })) return window.alert('Complete o título e o conteúdo de cada bloco.');

  const content = { titulo, tema, tipo, nivel: String(data.get('nivel') || 'Médio'), descricao: String(data.get('descricao') || '').trim(), status, blocos: blocks, atualizadoEm: new Date().toISOString() };
  if (editingId) updateContent(editingId, content);
  else createContent({ id: `content-${Date.now()}`, ...content, criadoEm: new Date().toISOString() });
  window.location.href = './portugues.html';
});

const existing = editingId ? getContents().find((content) => content.id === editingId) : null;
if (existing) {
  document.getElementById('pageTitle').textContent = 'Editar conteúdo';
  document.getElementById('contentTitle').value = existing.titulo || '';
  document.getElementById('contentTheme').value = existing.tema || '';
  if (contentTypeField) {
    contentTypeField.value = existing.tipo || 'aula';
  }
  document.getElementById('contentLevel').value = existing.nivel || 'Médio';
  document.getElementById('contentDescription').value = existing.descricao || '';
  blocks = Array.isArray(existing.blocos) ? existing.blocos.map((block) => ({ ...newBlock(block.tipo), ...block })) : [];
  document.getElementById('summaryTitle').textContent = existing.titulo || 'Sem título';
  document.getElementById('summaryTheme').textContent = existing.tema || 'Sem tema';
} else {
  blocks.push(newBlock());
}

renderBlocks();