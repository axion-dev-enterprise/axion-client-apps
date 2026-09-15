/**
 * AXION Client Apps - Gramaticalizando
 * Universal Toast Notification System (Dark 3D / Obsidian UI)
 * Replaces native alert() with sleek, non-blocking toast notifications.
 */

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('axion-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'axion-toast-container';
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'true');
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 420px;
        width: calc(100vw - 32px);
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

const ICONS = {
  sucesso: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  erro: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  aviso: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
};

const BORDERS = {
  sucesso: 'rgba(16, 185, 129, 0.35)',
  erro: 'rgba(239, 68, 68, 0.35)',
  aviso: 'rgba(245, 158, 11, 0.35)',
  info: 'rgba(139, 92, 246, 0.35)'
};

const ACCENTS = {
  sucesso: '#10b981',
  erro: '#ef4444',
  aviso: '#f59e0b',
  info: '#8b5cf6'
};

export function showToast(mensagem, tipo = 'info', duracao = 3600) {
  if (typeof window === 'undefined') return;
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `axion-toast axion-toast-${tipo}`;

  const icon = ICONS[tipo] || ICONS.info;
  const border = BORDERS[tipo] || BORDERS.info;
  const accent = ACCENTS[tipo] || ACCENTS.info;

  toast.style.cssText = `
    background: rgba(18, 18, 23, 0.94);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: #f4f4f5;
    border: 1px solid ${border};
    border-left: 4px solid ${accent};
    padding: 14px 16px;
    border-radius: 12px;
    font-family: Inter, system-ui, -apple-system, sans-serif;
    font-size: 13.5px;
    line-height: 1.45;
    font-weight: 500;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2);
    pointer-events: auto;
    opacity: 0;
    transform: translateY(16px) scale(0.97);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative;
    overflow: hidden;
  `;

  toast.innerHTML = `
    <div style="flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center;">
      ${icon}
    </div>
    <div style="flex: 1; word-break: break-word; color: #f4f4f5; padding-right: 8px;">
      ${mensagem}
    </div>
    <button type="button" aria-label="Fechar" style="
      background: transparent;
      border: none;
      color: #71717a;
      cursor: pointer;
      padding: 2px;
      margin: -2px -4px 0 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: color 0.15s ease;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="axion-toast-progress" style="
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background: ${accent};
      width: 100%;
      transform-origin: left;
      transition: transform ${duracao}ms linear;
    "></div>
  `;

  container.appendChild(toast);

  // Entrance
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) scale(1)';
    const progress = toast.querySelector('.axion-toast-progress');
    if (progress) {
      requestAnimationFrame(() => {
        progress.style.transform = 'scaleX(0)';
      });
    }
  });

  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  };

  const timer = setTimeout(dismiss, duracao);

  const closeBtn = toast.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = '#ffffff'; });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = '#71717a'; });
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      dismiss();
    });
  }

  return { dismiss };
}

// Global hook
if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
