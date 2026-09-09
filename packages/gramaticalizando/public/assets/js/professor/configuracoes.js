import { initProfessorPage } from './base.js';

const session = initProfessorPage('settings');
if (!session) throw new Error('Acesso negado.');

const toggles = Array.from(document.querySelectorAll('.toggle-control input'));

toggles.forEach((toggle) => {
  toggle.addEventListener('change', () => {
    const state = toggle.checked ? 'ativado' : 'desativado';
    const cardP = toggle.closest('.settings-card')?.querySelector('p');
    if (cardP) {
      cardP.textContent = cardP.textContent;
    }
    console.log(`Configuração ${toggle.id} ${state}`);
  });
});
