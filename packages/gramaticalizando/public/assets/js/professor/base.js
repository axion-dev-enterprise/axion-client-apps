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

  // Sidebar toggle com backdrop dinâmico
  const menuBtn = document.querySelector('[data-mobile-menu-button]');
  const sidebar = document.querySelector('.professor-sidebar');
  if (menuBtn && sidebar) {
    let backdrop = document.querySelector('.professor-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'professor-backdrop';
      document.body.appendChild(backdrop);
    }

    const toggleSidebar = (show) => {
      const shouldShow = typeof show === 'boolean' ? show : !sidebar.classList.contains('show');
      sidebar.classList.toggle('show', shouldShow);
      backdrop.classList.toggle('show', shouldShow);
      menuBtn.setAttribute('aria-expanded', String(shouldShow));
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    backdrop.addEventListener('click', () => toggleSidebar(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('show')) {
        toggleSidebar(false);
      }
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
