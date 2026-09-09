/**
 * AXION Client Apps - Gramaticalizando
 * Universal Toast Notification Component (ESM)
 */

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('axion-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'axion-toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 380px;
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

export function showToast(mensagem, tipo = 'info', duracao = 3500) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `axion-toast axion-toast-${tipo}`;

  const cores = {
    sucesso: { bg: '#065f46', border: '#10b981', color: '#ecfdf5' },
    erro: { bg: '#7f1d1d', border: '#ef4444', color: '#fef2f2' },
    aviso: { bg: '#78350f', border: '#f59e0b', color: '#fffbeb' },
    info: { bg: '#1e1b4b', border: '#6366f1', color: '#eef2ff' }
  };

  const c = cores[tipo] || cores.info;

  toast.style.cssText = `
    background: ${c.bg};
    color: ${c.color};
    border: 1px solid ${c.border};
    padding: 12px 16px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    pointer-events: auto;
    opacity: 0;
    transform: translateY(12px);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  toast.textContent = mensagem;
  container.appendChild(toast);

  // Animação de entrada
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Remoção suave
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }, duracao);
}
