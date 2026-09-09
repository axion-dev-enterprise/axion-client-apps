import { initPage } from './page-base.js';
import { getSession, getUsers, saveUsers } from './storage.js';

initPage();

function showToast(message, isError = false) {
  let toast = document.getElementById('settings-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'settings-toast';
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

const formAlterarSenha = document.getElementById('formAlterarSenha');
if (formAlterarSenha) {
  formAlterarSenha.addEventListener('submit', (e) => {
    e.preventDefault();
    const session = getSession();
    if (!session) {
      showToast('Sessão expirada. Faça login novamente.', true);
      return;
    }

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmNovaSenha = document.getElementById('confirmNovaSenha').value;

    if (novaSenha.length < 8) {
      showToast('A nova senha deve ter no mínimo 8 caracteres.', true);
      return;
    }

    if (novaSenha !== confirmNovaSenha) {
      showToast('A confirmação da nova senha não coincide.', true);
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === session.id || u.email === session.email);
    if (userIndex === -1) {
      showToast('Usuário não localizado no banco.', true);
      return;
    }

    if (users[userIndex].senha && users[userIndex].senha !== senhaAtual) {
      showToast('A senha atual informada está incorreta.', true);
      return;
    }

    users[userIndex].senha = novaSenha;
    saveUsers(users);

    formAlterarSenha.reset();
    showToast('Senha atualizada com sucesso!');
  });
}

const btnSalvarPrefs = document.getElementById('btnSalvarPrefs');
if (btnSalvarPrefs) {
  btnSalvarPrefs.addEventListener('click', () => {
    const prefs = {
      correcoes: document.getElementById('prefCorrecoes')?.checked,
      lembrete: document.getElementById('prefLembrete')?.checked,
      novosMateriais: document.getElementById('prefNovosMateriais')?.checked
    };
    localStorage.setItem('app_preferencias_aluno', JSON.stringify(prefs));
    showToast('Preferências salvas com sucesso!');
  });
}
