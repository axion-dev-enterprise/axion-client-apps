import { initProfessorPage } from './base.js';
import { getStudyPlan, saveStudyPlan } from '../storage.js';

initProfessorPage('cronograma');
const form = document.getElementById('planForm');
const stagesList = document.getElementById('stagesList');
const emptyStages = document.getElementById('emptyStages');
let plan = getStudyPlan();
const resourceTypes = ['Questão', 'PDF', 'Material', 'Link', 'Videoaula', 'Imagem'];
const maxResourceSize = 20 * 1024 * 1024;
let stages = Array.isArray(plan.etapas) ? plan.etapas.map((stage) => ({
  ...stage,
  recursoTipo: resourceTypes.includes(stage.recursoTipo) ? stage.recursoTipo : 'PDF',
  questao: {
    enunciado: stage.questao?.enunciado || '',
    alternativas: Array.isArray(stage.questao?.alternativas) && stage.questao.alternativas.length === 4 ? stage.questao.alternativas : ['', '', '', ''],
    correta: Number.isInteger(stage.questao?.correta) ? stage.questao.correta : null
  }
})) : [];

const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const newStage = () => ({ id: `stage-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, titulo: '', materia: 'Português', data: '', descricao: '', recursoTipo: 'Questão', recursoNome: '', recursoLink: '', questao: { enunciado: '', alternativas: ['', '', '', ''], correta: null }, concluido: false });
const resourceLabel = { Questão: 'Enunciado ou link da questão', PDF: 'Arquivo PDF', Material: 'Endereço do material', Link: 'Endereço do link', Videoaula: 'Link da videoaula', Imagem: 'Endereço da imagem' };
const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => resolve(reader.result));
  reader.addEventListener('error', () => reject(new Error('Não foi possível ler o arquivo.')));
  reader.readAsDataURL(file);
});

const renderStages = () => {
  emptyStages.classList.toggle('hidden', stages.length > 0);
  stagesList.innerHTML = stages.map((stage, index) => {
    const isUpload = stage.recursoTipo === 'PDF' || stage.recursoTipo === 'Imagem';
    const accept = stage.recursoTipo === 'PDF' ? 'application/pdf,.pdf' : 'image/*';
    const questionEditor = stage.recursoTipo === 'Questão'
      ? `<div class="schedule-question-editor"><div class="input-group"><label>Enunciado da questão *</label><textarea data-question-field="enunciado" rows="3" placeholder="Digite o enunciado da questão">${escapeHtml(stage.questao.enunciado)}</textarea></div><div class="schedule-question-options">${stage.questao.alternativas.map((option, optionIndex) => `<div class="input-group"><label>Alternativa ${String.fromCharCode(65 + optionIndex)} *</label><div class="schedule-option-row"><input data-option-index="${optionIndex}" value="${escapeHtml(option)}" placeholder="Digite a alternativa"><label class="schedule-correct-option"><input type="radio" name="correct-${escapeHtml(stage.id)}" data-correct-index="${optionIndex}" ${stage.questao.correta === optionIndex ? 'checked' : ''}> Correta</label></div></div>`).join('')}</div></div>`
      : '';
    const resourceField = isUpload
      ? `<input data-resource-file type="file" accept="${accept}"><small class="field-help">${stage.recursoLink ? 'Arquivo carregado.' : 'Selecione um arquivo.'} Limite de 20 MB.</small>`
      : `<textarea data-field="recursoLink" rows="2" placeholder="${stage.recursoTipo === 'Questão' ? 'Digite o enunciado ou cole o link da questão' : 'https://...'}">${escapeHtml(stage.recursoLink)}</textarea>`;
    return `<article class="block-field-card" data-stage-id="${escapeHtml(stage.id)}"><div class="block-editor-header"><div><h3>Bloco ${index + 1}</h3><p>O aluno poderá marcar este bloco como feito.</p></div><button type="button" class="btn btn-secondary" data-remove-stage>Remover</button></div><div class="block-setup-grid"><div class="input-group"><label>Título do bloco *</label><input data-field="titulo" value="${escapeHtml(stage.titulo)}" placeholder="Ex.: Questão de interpretação"></div><div class="input-group"><label>Matéria</label><input data-field="materia" value="${escapeHtml(stage.materia)}" placeholder="Ex.: Português"></div><div class="input-group"><label>Data do bloco</label><input data-field="data" type="date" value="${escapeHtml(stage.data)}"></div></div><div class="input-group"><label>Orientação</label><textarea data-field="descricao" rows="2" placeholder="Explique como estudar este bloco.">${escapeHtml(stage.descricao)}</textarea></div><div class="block-setup-grid"><div class="input-group"><label>Recurso</label><select data-field="recursoTipo">${resourceTypes.map((type) => `<option value="${type}" ${stage.recursoTipo === type ? 'selected' : ''}>${type}</option>`).join('')}</select></div><div class="input-group"><label>Nome do recurso</label><input data-field="recursoNome" value="${escapeHtml(stage.recursoNome)}" placeholder="Ex.: Questão 1 ou PDF de revisão"></div>${stage.recursoTipo !== 'Questão' ? `<div class="input-group"><label>${resourceLabel[stage.recursoTipo] || 'Endereço do recurso'}</label>${resourceField}</div>` : ''}</div>${questionEditor}</article>`;
  }).join('');
  document.getElementById('summaryStages').textContent = String(stages.length);
};

const syncField = (event) => { const card = event.target.closest('[data-stage-id]'); if (!card) return; const stage = stages.find((item) => item.id === card.dataset.stageId); if (stage && event.target.dataset.field) stage[event.target.dataset.field] = event.target.value; };
const syncQuestionField = (event) => {
  const card = event.target.closest('[data-stage-id]');
  const stage = stages.find((item) => item.id === card?.dataset.stageId);
  if (!stage) return;
  if (event.target.dataset.questionField) stage.questao.enunciado = event.target.value;
  if (event.target.dataset.optionIndex !== undefined) stage.questao.alternativas[Number(event.target.dataset.optionIndex)] = event.target.value;
  if (event.target.dataset.correctIndex !== undefined) stage.questao.correta = Number(event.target.dataset.correctIndex);
};
stagesList.addEventListener('input', syncField);
stagesList.addEventListener('input', syncQuestionField);
stagesList.addEventListener('change', (event) => {
  syncField(event);
  syncQuestionField(event);
  if (event.target.dataset.field === 'recursoTipo') renderStages();
});
stagesList.addEventListener('click', (event) => { const button = event.target.closest('[data-remove-stage]'); if (!button) return; const id = button.closest('[data-stage-id]').dataset.stageId; stages = stages.filter((stage) => stage.id !== id); renderStages(); });
stagesList.addEventListener('change', async (event) => {
  const input = event.target.closest('[data-resource-file]');
  if (!input || !input.files[0]) return;
  const stage = stages.find((item) => item.id === input.closest('[data-stage-id]').dataset.stageId);
  const file = input.files[0];
  const isPdf = stage.recursoTipo === 'PDF';
  const validType = isPdf ? file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') : file.type.startsWith('image/');
  if (!validType) { window.alert(`Selecione ${isPdf ? 'um PDF' : 'uma imagem'} válido.`); input.value = ''; return; }
  if (file.size > maxResourceSize) { window.alert('O arquivo deve ter no máximo 20 MB.'); input.value = ''; return; }
  try { stage.recursoLink = await readFileAsDataUrl(file); stage.recursoNome = stage.recursoNome || file.name; renderStages(); } catch (error) { window.alert(error.message); }
});
document.getElementById('addStageBtn').addEventListener('click', () => { stages.push(newStage()); renderStages(); stagesList.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
document.getElementById('planName').addEventListener('input', (event) => { document.getElementById('summaryName').textContent = event.target.value.trim() || 'Sem nome'; });
document.getElementById('planTitle').addEventListener('input', (event) => { document.getElementById('summaryTitle').textContent = event.target.value.trim() || 'Sem título'; });
['planStart', 'planEnd'].forEach((id) => document.getElementById(id).addEventListener('change', () => { const start = document.getElementById('planStart').value; const end = document.getElementById('planEnd').value; document.getElementById('summaryPeriod').textContent = start && end ? `${start} até ${end}` : 'Defina as datas'; }));

form.addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(form); const nome = String(data.get('nome') || '').trim(); const titulo = String(data.get('titulo') || '').trim(); const inicio = String(data.get('inicio') || ''); const fim = String(data.get('fim') || ''); if (!nome || !titulo || !inicio || !fim) return window.alert('Preencha nome, título e período do cronograma.'); if (fim < inicio) return window.alert('A data final deve ser posterior à data inicial.'); if (!stages.length) return window.alert('Adicione pelo menos um bloco.'); if (stages.some((stage) => !stage.titulo.trim() || (stage.recursoTipo === 'Questão' && (!stage.questao.enunciado.trim() || stage.questao.alternativas.some((option) => !option.trim()) || stage.questao.correta === null)))) return window.alert('Complete o enunciado, as quatro alternativas e marque a resposta correta.'); saveStudyPlan({ ...plan, id: plan.id && plan.id !== 'plan-default' ? plan.id : `plan-${Date.now()}`, nome, titulo, objetivo: String(data.get('objetivo') || '').trim(), inicio, fim, etapas: stages, atualizadoEm: new Date().toISOString() }); window.alert('Cronograma salvo em JSON com sucesso.'); });

document.getElementById('planName').value = plan.nome === 'Plano de estudos' ? '' : plan.nome || '';
document.getElementById('planTitle').value = plan.titulo === 'Plano de estudos' ? '' : plan.titulo || '';
document.getElementById('planObjective').value = plan.objetivo || '';
document.getElementById('planStart').value = plan.inicio || '';
document.getElementById('planEnd').value = plan.fim || '';
document.getElementById('summaryName').textContent = plan.nome === 'Plano de estudos' ? 'Sem nome' : plan.nome || 'Sem nome';
document.getElementById('summaryTitle').textContent = plan.titulo === 'Plano de estudos' ? 'Sem título' : plan.titulo || 'Sem título';
renderStages();
