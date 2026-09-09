import { initPage } from './page-base.js';
import { createSimulation, getSimulations, saveSimulations } from './storage.js';

initPage();

const listElement = document.getElementById('simuladosList');
const countBadge = document.getElementById('simuladoCountBadge');
const quizElement = document.getElementById('simuladoQuiz');
const quizTitle = document.getElementById('simuladoQuizTitle');
const quizProgress = document.getElementById('simuladoProgress');
const questionElement = document.getElementById('simuladoQuestion');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const resultsElement = document.getElementById('simuladoResults');
const resultContent = document.getElementById('simuladoResultContent');

let simulations = [];
let activeSimulation = null;
let answers = [];
let activeIndex = 0;

const createSeedSimulations = () => {
  const seed = [
    {
      id: 'sim-seed-1',
      titulo: 'Simulado de Matemática',
      materia: 'Matemática',
      duracao: 30,
      dificuldade: 'Médio',
      questoes: [
        {
          pergunta: 'Qual é o valor de 7 × 8?',
          opcoes: ['45', '56', '64', '49'],
          correta: '56'
        },
        {
          pergunta: 'Qual é a raiz quadrada de 81?',
          opcoes: ['7', '8', '9', '10'],
          correta: '9'
        },
        {
          pergunta: 'Qual é o resultado de 25 ÷ 5?',
          opcoes: ['4', '5', '6', '7'],
          correta: '5'
        }
      ]
    },
    {
      id: 'sim-seed-2',
      titulo: 'Simulado de Português',
      materia: 'Português',
      duracao: 30,
      dificuldade: 'Médio',
      questoes: [
        {
          pergunta: 'Qual palavra está corretamente acentuada?',
          opcoes: ['cafe', 'café', 'cafè', 'cafê'],
          correta: 'café'
        },
        {
          pergunta: 'Qual alternativa apresenta frase com sujeito simples?',
          opcoes: ['Os alunos estudaram bastante.', 'As crianças e os professores chegaram cedo.', 'Houve muitas dúvidas.', 'Faz muito calor.'],
          correta: 'Os alunos estudaram bastante.'
        },
        {
          pergunta: 'Qual das opções é uma conjunção adversativa?',
          opcoes: ['porque', 'mas', 'embora', 'e'],
          correta: 'mas'
        }
      ]
    },
    {
      id: 'sim-seed-3',
      titulo: 'Simulado de Redação',
      materia: 'Redação',
      duracao: 20,
      dificuldade: 'Avançado',
      questoes: [
        {
          pergunta: 'Qual elemento é essencial para a coesão textual?',
          opcoes: ['Imagem', 'Conectivos', 'Título', 'Fonte'],
          correta: 'Conectivos'
        },
        {
          pergunta: 'O que torna uma tese clara?',
          opcoes: ['Frases longas', 'Argumento objetivo', 'Muitas ideias sem filtro', 'Uso de metáforas'],
          correta: 'Argumento objetivo'
        }
      ]
    }
  ];

  saveSimulations(seed);
  simulations = seed;
};

const ensureSimulations = () => {
  simulations = getSimulations();
  if (!simulations.length) {
    createSeedSimulations();
  }
};

const renderList = () => {
  if (!listElement) return;

  ensureSimulations();
  countBadge.textContent = `${simulations.length}`;

  listElement.innerHTML = simulations.map((simulation) => `
    <article class="simulado-item">
      <div class="simulado-item-top">
        <h3>${simulation.titulo}</h3>
        <span class="status-badge">${simulation.dificuldade || 'Geral'}</span>
      </div>
      <div class="simulado-meta">
        <span>Matéria: ${simulation.materia || '—'}</span>
        <span>Duração: ${simulation.duracao || 30} min</span>
        <span>Questões: ${Array.isArray(simulation.questoes) ? simulation.questoes.length : 0}</span>
      </div>
      <button type="button" class="btn btn-primary" data-simulado-id="${simulation.id}">Iniciar simulado</button>
    </article>
  `).join('');
};

const showQuiz = () => {
  quizElement.classList.remove('hidden');
  resultsElement.classList.add('hidden');
};

const showResults = () => {
  quizElement.classList.add('hidden');
  resultsElement.classList.remove('hidden');
};

const getCurrentQuestion = () => activeSimulation?.questoes?.[activeIndex] || null;

const renderQuestion = () => {
  if (!activeSimulation) return;

  const question = getCurrentQuestion();
  if (!question) return;

  const total = activeSimulation.questoes.length;
  quizTitle.textContent = activeSimulation.titulo;
  quizProgress.textContent = `${activeIndex + 1}/${total}`;

  const optionsMarkup = question.opcoes.map((option, optionIndex) => {
    const selected = answers[activeIndex] === optionIndex;
    return `
      <button type="button" class="question-option ${selected ? 'selected' : ''}" data-option-index="${optionIndex}">
        <strong>${String.fromCharCode(65 + optionIndex)}</strong>
        <span>${option}</span>
      </button>
    `;
  }).join('');

  questionElement.innerHTML = `
    <div class="question-text">${activeIndex + 1}. ${question.pergunta}</div>
    <div class="question-options">${optionsMarkup}</div>
  `;

  prevQuestionBtn.disabled = activeIndex === 0;
  nextQuestionBtn.textContent = activeIndex === total - 1 ? 'Finalizar' : 'Próxima';
};

const completeExam = () => {
  if (!activeSimulation) return;

  const total = activeSimulation.questoes.length;
  const correctCount = activeSimulation.questoes.reduce((count, question, index) => {
    const userChoice = answers[index];
    if (userChoice == null) return count;
    return question.opcoes[userChoice] === question.correta ? count + 1 : count;
  }, 0);

  const percentage = Math.round((correctCount / total) * 100);
  const feedback = percentage >= 80 ? 'Excelente desempenho.' : percentage >= 60 ? 'Bom desempenho, continue praticando.' : 'Você está no caminho certo. Revise os pontos que ficaram em dúvida.';

  resultContent.innerHTML = `
    <div class="result-score">${percentage}%</div>
    <div class="result-text">
      <strong>${activeSimulation.titulo}</strong><br>
      Você acertou ${correctCount} de ${total} questões.<br>
      ${feedback}
    </div>
  `;

  showResults();
};

const startSimulation = (simulationId) => {
  simulations = getSimulations();
  const selected = simulations.find((simulation) => simulation.id === simulationId);
  if (!selected) return;

  activeSimulation = selected;
  answers = Array(selected.questoes.length).fill(null);
  activeIndex = 0;
  showQuiz();
  renderQuestion();
};

const nextQuestion = () => {
  if (!activeSimulation) return;

  if (answers[activeIndex] === null) {
    window.alert('Selecione uma alternativa antes de continuar.');
    return;
  }

  if (activeIndex < activeSimulation.questoes.length - 1) {
    activeIndex += 1;
    renderQuestion();
    return;
  }

  completeExam();
};

const previousQuestion = () => {
  if (!activeSimulation || activeIndex === 0) return;
  activeIndex -= 1;
  renderQuestion();
};

listElement?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-simulado-id]');
  if (!button) return;
  startSimulation(button.dataset.simuladoId);
});

questionElement?.addEventListener('click', (event) => {
  const option = event.target.closest('[data-option-index]');
  if (!option) return;

  answers[activeIndex] = Number(option.dataset.optionIndex);
  renderQuestion();
});

prevQuestionBtn?.addEventListener('click', previousQuestion);
nextQuestionBtn?.addEventListener('click', nextQuestion);

ensureSimulations();
renderList();
