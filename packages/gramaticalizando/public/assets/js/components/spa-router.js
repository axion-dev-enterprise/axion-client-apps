// SPA Router Elegante e Rápido para Gramaticalizando
const pageCache = new Map();

let progressBar = null;
const getProgressBar = () => {
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'spa-progress-bar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #7c3aed, #a855f7, #38bdf8);
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.8);
      z-index: 999999;
      opacity: 0;
      pointer-events: none;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    `;
    document.body.appendChild(progressBar);
  }
  return progressBar;
};

const startProgress = () => {
  const bar = getProgressBar();
  bar.style.opacity = '1';
  bar.style.width = '35%';
  setTimeout(() => {
    if (bar.style.opacity === '1') {
      bar.style.width = '75%';
    }
  }, 100);
};

const finishProgress = () => {
  const bar = getProgressBar();
  bar.style.width = '100%';
  setTimeout(() => {
    bar.style.opacity = '0';
    setTimeout(() => {
      bar.style.width = '0%';
    }, 200);
  }, 150);
};

export const normalizeCleanUrl = (url) => {
  try {
    const parsed = new URL(url, window.location.origin);
    let pathname = parsed.pathname;
    
    // Mapeamentos para rotas limpas
    if (pathname === '/pages/login.html' || pathname === '/login.html') pathname = '/login';
    else if (pathname === '/pages/registro.html' || pathname === '/registro.html') pathname = '/registro';
    else if (pathname === '/pages/home.html' || pathname === '/home.html') pathname = '/home';
    else if (pathname === '/pages/diagnostico.html' || pathname === '/diagnostico.html') pathname = '/diagnostico';
    else if (pathname === '/pages/portugues.html' || pathname === '/portugues.html') pathname = '/portugues';
    else if (pathname === '/pages/portugues-conteudo.html' || pathname === '/portugues-conteudo.html') pathname = '/portugues-conteudo';
    else if (pathname === '/pages/redacao.html' || pathname === '/redacao.html') pathname = '/redacao';
    else if (pathname === '/pages/videoaulas.html' || pathname === '/videoaulas.html') pathname = '/videoaulas';
    else if (pathname === '/pages/simulados.html' || pathname === '/simulados.html') pathname = '/simulados';
    else if (pathname === '/pages/simulado-conteudo.html' || pathname === '/simulado-conteudo.html') pathname = '/simulado-conteudo';
    else if (pathname === '/pages/materiais.html' || pathname === '/materiais.html') pathname = '/materiais';
    else if (pathname === '/pages/cronograma.html' || pathname === '/cronograma.html') pathname = '/cronograma';
    else if (pathname === '/pages/perfil.html' || pathname === '/perfil.html') pathname = '/perfil';
    else if (pathname === '/pages/configuracoes.html' || pathname === '/configuracoes.html') pathname = '/configuracoes';
    else if (pathname === '/pages/index.html' || pathname === '/index.html') pathname = '/';
    else if (pathname.startsWith('/professor/index.html')) pathname = '/professor';
    else if (pathname.startsWith('/professor/') && pathname.endsWith('.html')) pathname = pathname.replace(/\.html$/, '');

    parsed.pathname = pathname;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch (e) {
    return url;
  }
};

export const navigateTo = async (targetUrl, pushState = true) => {
  const cleanTarget = normalizeCleanUrl(targetUrl);
  const targetParsed = new URL(cleanTarget, window.location.origin);
  
  // Não navegar para âncora na mesma página
  if (targetParsed.pathname === window.location.pathname && targetParsed.hash) {
    const el = document.querySelector(targetParsed.hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (pushState) window.history.pushState(null, '', cleanTarget);
      return;
    }
  }

  startProgress();

  try {
    let html = pageCache.get(targetParsed.pathname);
    if (!html) {
      const res = await fetch(cleanTarget);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
      pageCache.set(targetParsed.pathname, html);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Identificar o container principal
    const currentContainer = document.querySelector('main') || document.querySelector('.dashboard-main') || document.querySelector('.professor-main') || document.body;
    const newContainer = doc.querySelector('main') || doc.querySelector('.dashboard-main') || doc.querySelector('.professor-main') || doc.body;

    // Se o layout for compatível, fazer crossfade no container principal
    if (currentContainer && newContainer && currentContainer.tagName === newContainer.tagName) {
      currentContainer.style.transition = 'opacity 0.12s ease, transform 0.12s ease';
      currentContainer.style.opacity = '0';
      currentContainer.style.transform = 'translateY(4px)';

      setTimeout(() => {
        currentContainer.innerHTML = newContainer.innerHTML;
        document.title = doc.title;

        // Atualizar links ativos
        document.querySelectorAll('nav a, .nav-links a, .professor-sidebar-nav a').forEach((a) => {
          const href = a.getAttribute('href');
          if (href && (href === targetParsed.pathname || href === cleanTarget)) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });

        // Executar scripts contidos no novo container caso existam
        doc.querySelectorAll('script[type="module"]').forEach(s => {
          const src = s.getAttribute('src');
          if (src && !src.includes('app.js')) {
            const newScript = document.createElement('script');
            newScript.type = 'module';
            newScript.src = `${src}?_t=${Date.now()}`;
            document.body.appendChild(newScript);
          }
        });

        if (pushState) {
          window.history.pushState(null, '', cleanTarget);
        }

        window.scrollTo({ top: 0, behavior: 'instant' });

        currentContainer.style.opacity = '1';
        currentContainer.style.transform = 'translateY(0)';
        finishProgress();

        window.dispatchEvent(new CustomEvent('app:spa-navigated', { detail: { path: cleanTarget } }));
      }, 120);
    } else {
      // Diferentes cascas (ex: login para painel), fallback com substituição limpa
      window.location.href = cleanTarget;
    }
  } catch (err) {
    console.warn('SPA navigation fallback to standard load:', err);
    finishProgress();
    window.location.href = cleanTarget;
  }
};

export const initSpaRouter = () => {
  // Limpeza proativa de URLs com .html na barra de endereços
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('.html') || currentPath.startsWith('/pages/')) {
    const clean = normalizeCleanUrl(window.location.href);
    if (clean !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, '', clean);
    }
  }

  // Interceptar cliques em links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignorar links externos, mailto, tel, javascript, download ou target _blank
    if (
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href.startsWith('http://') ||
      href.startsWith('https://') && !href.startsWith(window.location.origin)
    ) {
      return;
    }

    // Se for âncora simples da mesma página, permitir rolagem nativa suave
    if (href.startsWith('#')) {
      return;
    }

    e.preventDefault();
    navigateTo(href, true);
  });

  // Tratar botão Voltar e Avançar do navegador
  window.addEventListener('popstate', () => {
    navigateTo(window.location.href, false);
  });
};
