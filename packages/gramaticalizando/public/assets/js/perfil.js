import { initPage } from './page-base.js';
import { getSession, saveSession, getUsers, saveUsers, getEssays, getSchedule } from './storage.js';

initPage();

const profileAvatar = document.getElementById('profileAvatar');
const profileNameDisplay = document.getElementById('profileNameDisplay');
const profileEmailDisplay = document.getElementById('profileEmailDisplay');
const metricRedacoes = document.getElementById('metricRedacoes');
const metricMetas = document.getElementById('metricMetas');

const profNome = document.getElementById('profNome');
const profEmail = document.getElementById('profEmail');
const profTelefone = document.getElementById('profTelefone');
const profObjetivo = document.getElementById('profObjetivo');
const profileForm = document.getElementById('profileForm');

function showToast(message, isError = false) {
  let toast = document.getElementById('profile-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'profile-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1f1630;color:#fff;padding:12px 24px;border-radius:12px;font-size:0.95rem;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,0.25);z-index:9999;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);opacity:0;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.style.background = isError ? '#dc2626' : '#10b981';
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 3500);
}

function loadProfile() {
  const session = getSession() || {
    id: 'demo-aluno',
    nome: 'Aluno Gramaticalizando',
    email: 'aluno@gramaticalizando.com.br',
    telefone: '(11) 98888-7777',
    tipo: 'cliente'
  };

  const users = getUsers();
  const fullUser = users.find(u => u.id === session.id) || session;

  const initial = (fullUser.nome || 'A').charAt(0).toUpperCase();
  if (profileAvatar) profileAvatar.textContent = initial;
  if (profileNameDisplay) profileNameDisplay.textContent = fullUser.nome || 'Aluno';
  if (profileEmailDisplay) profileEmailDisplay.textContent = fullUser.email || '';

  if (profNome) profNome.value = fullUser.nome || '';
  if (profEmail) profEmail.value = fullUser.email || '';
  if (profTelefone) profTelefone.value = fullUser.telefone || '';
  if (profObjetivo && fullUser.objetivo) profObjetivo.value = fullUser.objetivo;

  // Carregar métricas
  const essays = getEssays();
  const userEssays = essays.filter(e => e.autorId === fullUser.id || e.autor === fullUser.nome);
  if (metricRedacoes) metricRedacoes.textContent = String(userEssays.length);

  const schedule = getSchedule();
  const completedMetas = schedule.filter(s => s.concluido).length;
  if (metricMetas) metricMetas.textContent = String(completedMetas);
}

if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const session = getSession() || {};
    const nome = profNome.value.trim();
    const email = profEmail.value.trim();
    const telefone = profTelefone.value.trim();
    const objetivo = profObjetivo.value;

    if (!nome || !email) {
      showToast('Nome e e-mail são obrigatórios', true);
      return;
    }

    // Atualizar no storage
    const users = getUsers();
    const nextUsers = users.map(u => {
      if (u.id === session.id || u.email === session.email) {
        return { ...u, nome, email, telefone, objetivo };
      }
      return u;
    });
    saveUsers(nextUsers);

    // Atualizar sessão
    saveSession({ ...session, nome, email, telefone, objetivo });

    showToast('Perfil atualizado com sucesso!');
    loadProfile();
  });
}

document.addEventListener('DOMContentLoaded', loadProfile);
loadProfile();
