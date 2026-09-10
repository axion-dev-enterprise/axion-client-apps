import { getSession } from './storage.js';

const path = window.location.pathname.split('/').pop() || 'index.html';

window.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  const protectedPages = [
    'home.html', 'redacao.html', 'portugues.html', 'videoaulas.html',
    'simulados.html', 'materiais.html', 'cronograma.html', 'perfil.html', 'configuracoes.html'
  ];
  const needsDiagnostic = [
    'home.html', 'redacao.html', 'portugues.html', 'videoaulas.html',
    'simulados.html', 'materiais.html', 'cronograma.html', 'perfil.html', 'configuracoes.html'
  ];

  if (session && (path === 'login.html' || path === 'registro.html')) {
    if (session.tipo === 'professor') {
      window.location.href = '/professor/index.html';
    } else {
      window.location.href = '/pages/home.html';
    }
    return;
  }

  if (!session && protectedPages.includes(path)) {
    window.location.href = '/pages/login.html';
    return;
  }

  // Verificar se o diagnóstico foi preenchido (seja em session.diagnostico ou localStorage 'diagnostico_simples')
  const hasDiagnostic = Boolean(
    (session && session.diagnostico) ||
    localStorage.getItem('diagnostico_simples')
  );

  // Professores nunca são redirecionados para diagnóstico
  if (session && session.tipo !== 'professor' && !hasDiagnostic && needsDiagnostic.includes(path)) {
    window.location.href = '/pages/diagnostico.html';
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

