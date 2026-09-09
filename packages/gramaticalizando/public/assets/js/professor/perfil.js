import { initProfessorPage } from './base.js';
import { getSession } from '../storage.js';
import { formatDate, safeText } from './utils.js';

const session = initProfessorPage('profile');
if (!session) throw new Error('Acesso negado.');

const profName = document.getElementById('profName');
const profEmail = document.getElementById('profEmail');
const profType = document.getElementById('profType');
const profCreatedAt = document.getElementById('profCreatedAt');
const editButton = document.getElementById('editProfileBtn');

profName.textContent = safeText(session.nome);
profEmail.textContent = safeText(session.email);
profType.textContent = safeText(session.tipo || 'Professor');
profCreatedAt.textContent = formatDate(session.criadoEm);

if (editButton) {
  editButton.addEventListener('click', () => {
    window.alert('Edição de perfil ainda não implementada nesta versão.');
  });
}
