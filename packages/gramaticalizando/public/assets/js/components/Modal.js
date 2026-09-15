/**
 * AXION Client Apps - Gramaticalizando
 * Universal Custom Modal Dialog System (Dark 3D / Obsidian UI)
 * Replaces native confirm() and alert() dialogs with accessible, sleek custom modals.
 */

const MODAL_ICONS = {
  confirm: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  danger: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function showModalDialog({
  title = 'Confirmação',
  message = '',
  type = 'confirm',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isAlert = false
} = {}) {
  return new Promise((resolve) => {
    const existing = document.getElementById('axion-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'axion-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 10000000; background: rgba(10, 8, 18, 0.72); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);';

    const iconSvg = MODAL_ICONS[type] || MODAL_ICONS.confirm;
    const isDanger = type === 'danger';
    const primaryBg = isDanger
      ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
      : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)';
    const primaryHover = isDanger ? '#dc2626' : '#6d28d9';
    const primaryShadow = isDanger
      ? '0 6px 18px rgba(239, 68, 68, 0.3)'
      : '0 6px 18px rgba(124, 58, 237, 0.3)';

    const modal = document.createElement('div');
    modal.className = 'axion-modal-card';
    modal.style.cssText = 'background: #110d1f; border: 1px solid rgba(139, 92, 246, 0.22); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05); border-radius: 18px; width: 100%; max-width: 440px; overflow: hidden; transform: translateY(16px) scale(0.97); transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;';

    const cancelBtnHtml = !isAlert
      ? '<button id="axion-modal-cancel" style="padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.04); color: #cbd5e1; font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 150ms ease;">' + escapeHtml(cancelText) + '</button>'
      : '';

    modal.innerHTML = 
      '<div style="padding: 22px 24px 18px; display: flex; align-items: flex-start; gap: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">' +
        '<div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">' +
          iconSvg +
        '</div>' +
        '<div style="flex: 1; min-width: 0;">' +
          '<h3 style="margin: 0 0 6px; font-size: 1.05rem; font-weight: 600; color: #f8fafc; letter-spacing: -0.01em;">' + escapeHtml(title) + '</h3>' +
          '<div style="font-size: 0.9rem; line-height: 1.5; color: #cbd5e1; word-wrap: break-word;">' + escapeHtml(message).replace(/\n/g, '<br>') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="padding: 16px 24px; background: rgba(0, 0, 0, 0.2); display: flex; justify-content: flex-end; gap: 10px;">' +
        cancelBtnHtml +
        '<button id="axion-modal-confirm" style="padding: 9px 20px; border-radius: 10px; border: none; background: ' + primaryBg + '; color: #ffffff; font-size: 0.88rem; font-weight: 600; cursor: pointer; box-shadow: ' + primaryShadow + '; transition: all 150ms ease;">' +
          escapeHtml(confirmText) +
        '</button>' +
      '</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.transform = 'translateY(0) scale(1)';
    });

    const confirmBtn = overlay.querySelector('#axion-modal-confirm');
    const cancelBtn = overlay.querySelector('#axion-modal-cancel');

    if (confirmBtn) confirmBtn.focus();

    function close(result) {
      overlay.style.opacity = '0';
      modal.style.transform = 'translateY(12px) scale(0.97)';
      document.removeEventListener('keydown', onKeyDown);
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 180);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(false);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        close(true);
      }
    }

    document.addEventListener('keydown', onKeyDown);

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => close(true));
      confirmBtn.addEventListener('mouseenter', () => confirmBtn.style.filter = 'brightness(1.1)');
      confirmBtn.addEventListener('mouseleave', () => confirmBtn.style.filter = 'none');
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => close(false));
      cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.08)';
        cancelBtn.style.color = '#ffffff';
      });
      cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.04)';
        cancelBtn.style.color = '#cbd5e1';
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && !isAlert) {
        close(false);
      }
    });
  });
}

export function confirmModal(message, title = 'Confirmação', options = {}) {
  return showModalDialog({
    title,
    message,
    type: options.type || (title.toLowerCase().includes('excluir') ? 'danger' : 'confirm'),
    confirmText: options.confirmText || (options.type === 'danger' ? 'Excluir' : 'Confirmar'),
    cancelText: options.cancelText || 'Cancelar',
    isAlert: false
  });
}

export function customAlertModal(message, title = 'Aviso') {
  return showModalDialog({
    title,
    message,
    type: 'info',
    confirmText: 'OK',
    isAlert: true
  });
}

if (typeof window !== 'undefined') {
  window.confirmModal = confirmModal;
  window.customAlertModal = customAlertModal;
  window.showModalDialog = showModalDialog;
}
