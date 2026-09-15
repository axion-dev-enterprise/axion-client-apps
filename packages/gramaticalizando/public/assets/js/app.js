import { getSession, getStudentPermissions } from './storage.js';
import { showToast } from './components/Toast.js';
import { confirmModal, customAlertModal, showModalDialog } from './components/Modal.js';
import { initSpaRouter, navigateTo, normalizeCleanUrl } from './components/spa-router.js';

// Global zero-alert guardrail: route any lingering window.alert to sleek modern toast
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.confirmModal = confirmModal;
  window.customAlertModal = customAlertModal;
  window.showModalDialog = showModalDialog;
  window.alert = (mensagem) => {
    showToast(String(mensagem || ''), 'info', 4000);
  };
  window.navigateTo = navigateTo;
}

// Inicializar SPA Router instantâneo
if (typeof window !== 'undefined') {
  initSpaRouter();
}

const getNormalizedRoute = () => {
  const p = window.location.pathname.split('/').pop() || 'index';
  return p.replace(/\.html$/, '');
};

const route = getNormalizedRoute();

window.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  const protectedPages = [
    'home', 'redacao', 'portugues', 'videoaulas',
    'simulados', 'simulado-conteudo', 'materiais', 'cronograma', 'diagnostico', 'portugues-conteudo', 'perfil', 'configuracoes'
  ];
  const needsDiagnostic = [
    'home', 'redacao', 'portugues', 'videoaulas',
    'simulados', 'materiais', 'cronograma'
  ];
  const pagePermissions = {
    'portugues': 'portugues',
    'redacao': 'redacao',
    'videoaulas': 'videoaulas',
    'simulados': 'simulados',
    'simulado-conteudo': 'simulados',
    'materiais': 'material',
    'cronograma': 'cronograma',
    'portugues-conteudo': 'portugues'
  };

  if (session && (route === 'login' || route === 'registro')) {
    if (session.tipo === 'professor') {
      window.location.href = '/professor';
    } else {
      window.location.href = '/home';
    }
    return;
  }

  if (!session && protectedPages.includes(route)) {
    window.location.href = '/login';
    return;
  }

  // Verificar se o diagnóstico foi preenchido
  const hasDiagnostic = Boolean(
    (session && session.diagnostico) ||
    localStorage.getItem('diagnostico_simples')
  );

  // Professores nunca são redirecionados para diagnóstico
  if (session && session.tipo !== 'professor' && !hasDiagnostic && needsDiagnostic.includes(route)) {
    window.location.href = '/diagnostico';
    return;
  }

  // Restringir acesso às páginas do aluno de acordo com o plano vinculado
  if (session && session.tipo !== 'professor') {
    const requiredPermission = pagePermissions[route];
    if (requiredPermission && !getStudentPermissions(session.id || session.email)[requiredPermission]) {
      window.location.href = '/home';
      return;
    }
  }

  // Interatividade do Menu Mobile (Drawer)
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
