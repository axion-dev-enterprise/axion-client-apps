import { initPage } from './page-base.js';
import { getSession, getSimulationResult, getSimulations, saveSimulationResult } from './storage.js';

initPage();

const simulationId = new URLSearchParams(window.location.search).get('id');
const simulation = getSimulations().find((item) => item.id === simulationId) || getSimulations()[0];
const session = getSession();
const studentId = session?.id || session?.email;
const previousResult = getSimulationResult(simulation?.id, studentId);
const title = document.getElementById('simuladoTitle');
const progress = document.getElementById('simuladoProgress');
const subject = document.getElementById('simuladoSubject');
const duration = document.getElementById('simuladoDuration');
const difficulty = document.getElementById('simuladoDifficulty');
const timer = document.getElementById('simuladoTimer');
const currentMetric = document.getElementById('simuladoCurrentMetric');
const answeredMetric = document.getElementById('simuladoAnsweredMetric');
const questionElement = document.getElementById('simuladoQuestion');
const previousButton = document.getElementById('prevQuestionBtn');
const nextButton = document.getElementById('nextQuestionBtn');
const resultsElement = document.getElementById('simuladoResults');
const resultContent = document.getElementById('simuladoResultContent');

let answers = simulation ? Array(simulation.questoes.length).fill(null) : [];
let activeIndex = 0;
let timerInterval = null;
let timeExpired = false;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const getDurationSeconds = () => Math.max(1, Number(simulation?.duracao || 30) * 60);
const getTimerKey = () => `simulado_tempo_${simulation?.id || 'indisponivel'}`;
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const getStartedAt = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(getTimerKey()) || 'null');
    return saved?.startedAt || null;
  } catch {
    return null;
  }
};
const saveStartedAt = (startedAt) => sessionStorage.setItem(getTimerKey(), JSON.stringify({ startedAt }));
const clearTimer = () => {
  if (timerInterval) window.clearInterval(timerInterval);
  sessionStorage.removeItem(getTimerKey());
};

const renderCompleted = (result) => {
  title.textContent = simulation.titulo || 'Simulado';
  subject.textContent = simulation.materia || 'Português';
  duration.textContent = `${simulation.duracao || 30} min`;
  difficulty.textContent = simulation.dificuldade || 'Médio';
  timer.textContent = 'Concluído';
  timer.classList.add('is-expired');
  questionElement.innerHTML = '<div class="panel-card"><p>Este simulado já foi concluído e não pode ser respondido novamente.</p></div>';
  previousButton.classList.add('hidden');
  nextButton.classList.add('hidden');
  resultContent.innerHTML = `<div class="result-score">${result.percentage}%</div><div class="result-text"><strong>${escapeHtml(simulation.titulo || 'Simulado')}</strong><br>Você acertou ${result.correct} de ${result.total} questões.<br>Concluído em ${new Date(result.concluidoEm).toLocaleDateString('pt-BR')}.</div>`;
  resultsElement.classList.remove('hidden');
};

const renderUnavailable = () => {
  title.textContent = 'Simulado não encontrado';
  questionElement.innerHTML = '<div class="panel-card"><p>Este simulado não está disponível.</p></div>';
  previousButton.disabled = true;
  nextButton.disabled = true;
};

const finishSimulation = (expired = false) => {
  if (!simulation || timeExpired) return;
  timeExpired = true;
  clearTimer();
  const total = simulation.questoes.length;
  const correct = simulation.questoes.reduce((score, question, index) => {
    const answer = answers[index];
    return answer !== null && question.opcoes[answer] === question.correta ? score + 1 : score;
  }, 0);
  const percentage = Math.round((correct / total) * 100);
  const feedback = percentage >= 80 ? 'Excelente desempenho.' : percentage >= 60 ? 'Bom desempenho, continue praticando.' : 'Revise os pontos que ficaram em dúvida e tente novamente.';

  resultContent.innerHTML = `
    <div class="result-score">${percentage}%</div>
    <div class="result-text">
      <strong>${escapeHtml(simulation.titulo || 'Simulado')}</strong><br>
      ${expired ? 'O tempo acabou. ' : ''}Você acertou ${correct} de ${total} questões.<br>
      ${feedback}
    </div>
  `;
  if (studentId) {
    saveSimulationResult({
      simulationId: simulation.id,
      studentId,
      titulo: simulation.titulo || 'Simulado',
      correct,
      total,
      percentage
    });
  }
  questionElement.classList.add('hidden');
  previousButton.classList.add('hidden');
  nextButton.classList.add('hidden');
  resultsElement.classList.remove('hidden');
};

const updateTimer = () => {
  if (!simulation || timeExpired) return;
  const startedAt = getStartedAt();
  const elapsed = startedAt ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000) : 0;
  const remaining = Math.max(0, getDurationSeconds() - elapsed);
  timer.textContent = formatTime(remaining);
  timer.classList.toggle('is-expired', remaining === 0);
  if (remaining === 0) finishSimulation(true);
};

const startTimer = () => {
  if (!simulation) return;
  if (!getStartedAt()) saveStartedAt(new Date().toISOString());
  updateTimer();
  timerInterval = window.setInterval(updateTimer, 1000);
};

const renderQuestion = () => {
  if (!simulation) return renderUnavailable();

  const question = simulation.questoes[activeIndex];
  const total = simulation.questoes.length;
  title.textContent = simulation.titulo || 'Simulado';
  subject.textContent = simulation.materia || 'Português';
  duration.textContent = `${simulation.duracao || 30} min`;
  difficulty.textContent = simulation.dificuldade || 'Médio';
  progress.textContent = `${activeIndex + 1}/${total}`;
  currentMetric.textContent = `${activeIndex + 1}/${total}`;
  answeredMetric.textContent = String(answers.filter((answer) => answer !== null).length);

  const options = question.opcoes.map((option, optionIndex) => `
    <button type="button" class="study-option ${answers[activeIndex] === optionIndex ? 'is-selected' : ''}" data-option-index="${optionIndex}" aria-pressed="${answers[activeIndex] === optionIndex ? 'true' : 'false'}">
      <span class="study-option-letter">${String.fromCharCode(65 + optionIndex)}</span>
      <span>${escapeHtml(option)}</span>
    </button>
  `).join('');

  questionElement.innerHTML = `
    <section class="study-question-panel simulado-question-panel">
      <div class="study-question-header">
        <div>
          <span class="study-block-tag">Questão ${activeIndex + 1}</span>
          <h2>Escolha a alternativa correta</h2>
        </div>
        <span class="study-question-counter">${activeIndex + 1}/${total}</span>
      </div>
      <div class="study-question-body">
        <div class="study-question-copy">
          <p class="study-question-label">${escapeHtml(simulation.materia || 'Português')}</p>
          <h3>${escapeHtml(question.pergunta)}</h3>
        </div>
        <div class="study-options">${options}</div>
      </div>
    </section>
  `;

  previousButton.disabled = activeIndex === 0;
  nextButton.textContent = activeIndex === total - 1 ? 'Finalizar' : 'Próxima';
};

questionElement.addEventListener('click', (event) => {
  const option = event.target.closest('[data-option-index]');
  if (!option) return;
  answers[activeIndex] = Number(option.dataset.optionIndex);
  renderQuestion();
});

previousButton.addEventListener('click', () => {
  if (activeIndex === 0) return;
  activeIndex -= 1;
  renderQuestion();
});

nextButton.addEventListener('click', () => {
  if (answers[activeIndex] === null) {
    window.alert('Selecione uma alternativa antes de continuar.');
    return;
  }
  if (activeIndex < simulation.questoes.length - 1) {
    activeIndex += 1;
    renderQuestion();
    return;
  }
  finishSimulation(false);
});

if (previousResult) {
  renderCompleted(previousResult);
} else {
  renderQuestion();
  startTimer();
}
