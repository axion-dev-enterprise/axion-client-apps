import { getSession, clearSession } from '../storage.js';
import { showToast } from '../components/Toast.js';
import { confirmModal, customAlertModal, showModalDialog } from '../components/Modal.js';

if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.confirmModal = confirmModal;
  window.customAlertModal = customAlertModal;
  window.showModalDialog = showModalDialog;
  window.alert = (mensagem) => {
    showToast(String(mensagem || ''), 'info', 4000);
  };
}

export function initProfessorPage(activeNavKey = '') {
  let session = getSession();

  // Se não estiver logado ou não for professor, garantir sessão demo para visualização ou redirecionar
  if (!session || session.tipo !== 'professor') {
    session = {
      id: 'prof-demo',
      nome: 'Professor Gramaticalizando',
      email: 'professor@gramaticalizando.com.br',
      tipo: 'professor'
    };
  }

  // Sidebar toggle
  const menuBtn = document.querySelector('[data-mobile-menu-button]');
  const sidebar = document.querySelector('.professor-sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = '/login';
    });
  }

  // Marca item ativo
  if (activeNavKey) {
    document.querySelectorAll('.professor-nav-item').forEach(item => {
      if (item.getAttribute('data-nav-item') === activeNavKey) {
        item.classList.add('active');
      }
    });
  }

  return session;
}
