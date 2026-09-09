import { initProfessorPage } from './base.js';
import { createSimulation, deleteSimulation, getSimulations } from '../storage.js';

const session = initProfessorPage('simulados');
if (!session) throw new Error('Acesso negado.');

const list = document.getElementById('simuladoList');

const renderSimulations = () => {
  if (!list) return;

  const simulations = getSimulations();

  if (!simulations.length) {
    list.innerHTML = `
      <div class="activity-item">
        <strong>Nenhum simulado cadastrado</strong>
        <p>Crie um novo simulado para disponibilizar questões aos alunos.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = simulations.map((simulation) => `
    <article class="card-item">
      <div class="activity-meta">
        <strong>${simulation.titulo || 'Simulado sem título'}</strong>
        <span>${simulation.dificuldade || 'Geral'}</span>
      </div>
      <p><strong>Matéria:</strong> ${simulation.materia || '—'}</p>
      <p><strong>Duração:</strong> ${simulation.duracao || 30} min</p>
      <p><strong>Questões:</strong> ${Array.isArray(simulation.questoes) ? simulation.questoes.length : 0}</p>
      <div class="action-buttons">
        <button type="button" class="btn btn-secondary" disabled>Visualizar</button>
        <button type="button" class="btn btn-primary" data-delete-simulado="${simulation.id}">Excluir</button>
      </div>
    </article>
  `).join('');
};

list?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-simulado]');
  if (!button) return;

  const shouldDelete = window.confirm('Deseja excluir este simulado?');
  if (!shouldDelete) return;

  deleteSimulation(button.dataset.deleteSimulado);
  renderSimulations();
});

const seedSimulations = getSimulations();
if (!seedSimulations.length) {
  createSimulation({
    id: 'sim-seed-1',
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
        pergunta: 'Qual alternativa apresenta uma frase com sujeito simples?',
        opcoes: ['Os alunos estudaram bastante.', 'As crianças e os professores chegaram cedo.', 'Houve muitas dúvidas.', 'Faz muito calor.'],
        correta: 'Os alunos estudaram bastante.'
      }
    ],
    criadoEm: new Date().toISOString()
  });
}

renderSimulations();
