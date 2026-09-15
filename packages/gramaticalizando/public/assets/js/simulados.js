import { initPage } from './page-base.js';
import { createSimulation, getSession, getSimulationResult, getSimulations, saveSimulations } from './storage.js';

initPage();

const listElement = document.getElementById('simuladosList');
const countBadge = document.getElementById('simuladoCountBadge');
const session = getSession();
let simulations = [];

const createSeedSimulations = () => {
  const seed = [
    {
      id: 'sim-seed-2',
      titulo: 'Simulado de Português',
      materia: 'Português',
      duracao: 30,
      dificuldade: 'Médio',
      questoes: [
        { pergunta: 'Qual palavra está corretamente acentuada?', opcoes: ['cafe', 'café', 'cafè', 'cafê'], correta: 'café' },
        { pergunta: 'Qual alternativa apresenta frase com sujeito simples?', opcoes: ['Os alunos estudaram bastante.', 'As crianças e os professores chegaram cedo.', 'Houve muitas dúvidas.', 'Faz muito calor.'], correta: 'Os alunos estudaram bastante.' },
        { pergunta: 'Qual das opções é uma conjunção adversativa?', opcoes: ['porque', 'mas', 'embora', 'e'], correta: 'mas' }
      ]
    },
    {
      id: 'sim-seed-3',
      titulo: 'Simulado de Redação',
      materia: 'Redação',
      duracao: 20,
      dificuldade: 'Avançado',
      questoes: [
        { pergunta: 'Qual elemento é essencial para a coesão textual?', opcoes: ['Imagem', 'Conectivos', 'Título', 'Fonte'], correta: 'Conectivos' },
        { pergunta: 'O que torna uma tese clara?', opcoes: ['Frases longas', 'Argumento objetivo', 'Muitas ideias sem filtro', 'Uso de metáforas'], correta: 'Argumento objetivo' }
      ]
    }
  ];

  saveSimulations(seed);
  simulations = seed;
};

const ensureSimulations = () => {
  simulations = getSimulations();
  if (!simulations.length) createSeedSimulations();
};

const renderList = () => {
  if (!listElement) return;

  ensureSimulations();
  countBadge.textContent = String(simulations.length);
  listElement.innerHTML = simulations.map((simulation) => {
    const completed = getSimulationResult(simulation.id, session?.id || session?.email);
    return `
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
      <button type="button" class="btn ${completed ? 'btn-secondary' : 'btn-primary'}" data-simulado-id="${simulation.id}" ${completed ? 'disabled' : ''}>${completed ? 'Concluído' : 'Iniciar simulado'}</button>
    </article>
  `;
  }).join('');
};

listElement?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-simulado-id]');
  if (!button || button.disabled) return;
  window.location.href = `./simulado-conteudo.html?id=${encodeURIComponent(button.dataset.simuladoId)}`;
});

ensureSimulations();
renderList();
