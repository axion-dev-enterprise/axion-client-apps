/**
 * AXION Client Apps - Gramaticalizando
 * Universal Custom Dialog & Confirmation System (ESM)
 * Zero Native alert() / confirm() / prompt()
 */

let modalContainer = null;

function ensureContainer() {
  if (!modalContainer) {
    modalContainer = document.getElementById('axion-dialog-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'axion-dialog-container';
      document.body.appendChild(modalContainer);
    }
  }
  return modalContainer;
}

/**
 * Custom Confirmation Modal (Replaces native confirm())
 * @param {string} mensagem - Texto ou pergunta de confirmação
 * @param {string} titulo - Título do diálogo
 * @returns {Promise<boolean>}
 */
export function confirmModal(mensagem, titulo = 'Confirmação') {
  return new Promise((resolve) => {
    const container = ensureContainer();
    const overlay = document.createElement('div');
    overlay.className = 'axion-dialog-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000000;
      opacity: 0;
      transition: opacity 0.18s ease;
      padding: 16px;
    `;

    const dialog = document.createElement('div');
    dialog.className = 'axion-dialog-box';
    dialog.style.cssText = `
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
      transform: scale(0.96) translateY(10px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    `;

    dialog.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px;">
        <div style="width: 40px; height: 40px; border-radius: 10px; background: #ede9fe; color: #5046e5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">${titulo}</h3>
          <p style="font-size: 14px; color: #475569; line-height: 1.5; margin: 0;">${mensagem}</p>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button type="button" class="axion-dialog-cancel" style="padding: 10px 18px; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.15s ease;">Cancelar</button>
        <button type="button" class="axion-dialog-confirm" style="padding: 10px 20px; border-radius: 8px; border: none; background: #5046e5; color: #ffffff; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(80, 70, 229, 0.25); transition: background 0.15s ease;">Confirmar</button>
      </div>
    `;

    overlay.appendChild(dialog);
    container.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      dialog.style.transform = 'scale(1) translateY(0)';
    });

    const cleanup = (value) => {
      overlay.style.opacity = '0';
      dialog.style.transform = 'scale(0.96) translateY(8px)';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(value);
      }, 180);
    };

    const confirmBtn = dialog.querySelector('.axion-dialog-confirm');
    const cancelBtn = dialog.querySelector('.axion-dialog-cancel');

    confirmBtn.addEventListener('click', () => cleanup(true));
    cancelBtn.addEventListener('click', () => cleanup(false));

    const onKey = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        cleanup(false);
      }
    };
    document.addEventListener('keydown', onKey);
    setTimeout(() => confirmBtn.focus(), 50);
  });
}

/**
 * Custom Prompt Input Modal (Replaces native prompt())
 * @param {string} mensagem - Descrição ou instrução
 * @param {string} valorPadrao - Valor default inicial
 * @param {string} titulo - Título do diálogo
 * @returns {Promise<string|null>}
 */
export function promptModal(mensagem, valorPadrao = '', titulo = 'Inserir Informação') {
  return new Promise((resolve) => {
    const container = ensureContainer();
    const overlay = document.createElement('div');
    overlay.className = 'axion-dialog-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000000;
      opacity: 0;
      transition: opacity 0.18s ease;
      padding: 16px;
    `;

    const dialog = document.createElement('div');
    dialog.className = 'axion-dialog-box';
    dialog.style.cssText = `
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
      transform: scale(0.96) translateY(10px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    `;

    dialog.innerHTML = `
      <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">${titulo}</h3>
      <p style="font-size: 14px; color: #475569; line-height: 1.5; margin: 0 0 16px 0;">${mensagem}</p>
      <input type="text" class="axion-dialog-input" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; color: #0f172a; outline: none; transition: border-color 0.15s ease;" value="${valorPadrao}">
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button type="button" class="axion-dialog-cancel" style="padding: 10px 18px; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; font-weight: 600; font-size: 14px; cursor: pointer;">Cancelar</button>
        <button type="button" class="axion-dialog-confirm" style="padding: 10px 20px; border-radius: 8px; border: none; background: #5046e5; color: #ffffff; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(80, 70, 229, 0.25);">Salvar</button>
      </div>
    `;

    overlay.appendChild(dialog);
    container.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      dialog.style.transform = 'scale(1) translateY(0)';
    });

    const input = dialog.querySelector('.axion-dialog-input');
    const confirmBtn = dialog.querySelector('.axion-dialog-confirm');
    const cancelBtn = dialog.querySelector('.axion-dialog-cancel');

    input.addEventListener('focus', () => input.style.borderColor = '#5046e5');
    input.addEventListener('blur', () => input.style.borderColor = '#cbd5e1');

    const cleanup = (value) => {
      overlay.style.opacity = '0';
      dialog.style.transform = 'scale(0.96) translateY(8px)';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(value);
      }, 180);
    };

    confirmBtn.addEventListener('click', () => cleanup(input.value.trim()));
    cancelBtn.addEventListener('click', () => cleanup(null));

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') cleanup(input.value.trim());
      if (e.key === 'Escape') cleanup(null);
    });

    setTimeout(() => {
      input.focus();
      input.select();
    }, 60);
  });
}
