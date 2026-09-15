import { initProfessorPage } from './base.js';
import { createSimulation, getSimulations, updateSimulation } from '../storage.js';

const session = initProfessorPage('simulados');
if (!session) throw new Error('Acesso negado.');

const form = document.getElementById('simulationForm');
const questionsList = document.getElementById('questionsList');
const emptyQuestions = document.getElementById('emptyQuestions');
const editingId = new URLSearchParams(window.location.search).get('id');
let questions = [];

const escapeHtml = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const newQuestion = () => ({ id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, pergunta: '', opcoes: ['', '', '', ''], correta: '' });

const renderQuestions = () => {
  emptyQuestions.classList.toggle('hidden', questions.length > 0);
  questionsList.innerHTML = questions.map((question, index) => `<article class="block-field-card" data-question-id="${escapeHtml(question.id)}"><div class="block-editor-header"><div><h3>Questão ${index + 1}</h3><p>Marque a alternativa correta.</p></div><button class="btn btn-secondary" type="button" data-remove-question>Remover</button></div><div class="input-group"><label>Enunciado *</label><textarea data-field="pergunta" rows="3" placeholder="Digite o enunciado da questão.">${escapeHtml(question.pergunta)}</textarea></div><div class="block-setup-grid">${question.opcoes.map((option, optionIndex) => `<div class="input-group"><label>Alternativa ${String.fromCharCode(65 + optionIndex)} *</label><div class="question-input-row"><input data-option-index="${optionIndex}" type="text" value="${escapeHtml(option)}" placeholder="Digite a alternativa"><label class="correct-option"><input data-correct-index="${optionIndex}" type="radio" name="correct-${escapeHtml(question.id)}" ${question.correta === optionIndex ? 'checked' : ''}> Correta</label></div></div>`).join('')}</div></article>`).join('');
  document.getElementById('summaryQuestions').textContent = String(questions.length);
};

const getQuestion = (element) => questions.find((question) => question.id === element.closest('[data-question-id]').dataset.questionId);
questionsList.addEventListener('input', (event) => { const question = getQuestion(event.target); if (!question) return; if (event.target.dataset.field) question.pergunta = event.target.value; if (event.target.dataset.optionIndex !== undefined) question.opcoes[Number(event.target.dataset.optionIndex)] = event.target.value; });
questionsList.addEventListener('change', (event) => { const question = getQuestion(event.target); if (!question) return; if (event.target.dataset.correctIndex !== undefined) question.correta = Number(event.target.dataset.correctIndex); });
questionsList.addEventListener('click', (event) => { const button = event.target.closest('[data-remove-question]'); if (!button) return; const id = button.closest('[data-question-id]').dataset.questionId; questions = questions.filter((question) => question.id !== id); renderQuestions(); });
document.getElementById('addQuestionBtn').addEventListener('click', () => { questions.push(newQuestion()); renderQuestions(); questionsList.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
document.getElementById('simulationTitle').addEventListener('input', (event) => { document.getElementById('summaryTitle').textContent = event.target.value.trim() || 'Sem título'; });
document.getElementById('simulationDuration').addEventListener('input', (event) => { document.getElementById('summaryDuration').textContent = `${event.target.value || 0} minutos`; });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const titulo = String(data.get('titulo') || '').trim();
  const materia = String(data.get('materia') || '').trim();
  const duracao = Number(data.get('duracao'));
  if (!titulo || !materia || !duracao || duracao < 1) return window.alert('Preencha título, matéria e duração válida.');
  if (!questions.length) return window.alert('Adicione pelo menos uma questão.');
  if (questions.some((question) => !question.pergunta.trim() || question.opcoes.some((option) => !option.trim()) || question.correta === '')) return window.alert('Complete todas as alternativas e marque a resposta correta.');
  const simulation = { titulo, materia, duracao, dificuldade: String(data.get('dificuldade') || 'Médio'), questoes: questions.map(({ id, ...question }) => question), atualizadoEm: new Date().toISOString() };
  if (editingId) updateSimulation(editingId, simulation); else createSimulation({ id: `sim-${Date.now()}`, ...simulation, criadoEm: new Date().toISOString() });
  window.location.href = './simulados.html';
});

const existing = editingId ? getSimulations().find((simulation) => simulation.id === editingId) : null;
if (existing) {
  document.getElementById('pageTitle').textContent = 'Editar simulado';
  document.getElementById('simulationTitle').value = existing.titulo || '';
  document.getElementById('simulationSubject').value = existing.materia || '';
  document.getElementById('simulationDifficulty').value = existing.dificuldade || 'Médio';
  document.getElementById('simulationDuration').value = existing.duracao || 30;
  document.getElementById('summaryTitle').textContent = existing.titulo || 'Sem título';
  document.getElementById('summaryDuration').textContent = `${existing.duracao || 30} minutos`;
  questions = Array.isArray(existing.questoes) ? existing.questoes.map((question) => ({ ...newQuestion(), ...question, id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, opcoes: Array.isArray(question.opcoes) ? question.opcoes : ['', '', '', ''], correta: typeof question.correta === 'number' ? question.correta : (Array.isArray(question.opcoes) ? question.opcoes.indexOf(question.correta) : '') })) : [];
} else {
  questions.push(newQuestion());
}
renderQuestions();