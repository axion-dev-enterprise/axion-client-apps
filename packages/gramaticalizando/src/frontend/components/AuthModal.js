/**
 * AXION Client Apps - Gramaticalizando
 * Auth Modal Component (ESM)
 */

import { authApi } from '../services/api.js';
import { showToast } from './Toast.js';

export function setupAuthModal(options = {}) {
  const { onLoginSuccess, onRegisterSuccess } = options;

  const modalLogin = document.getElementById('modal-login');
  const modalRegistro = document.getElementById('modal-registro');
  const abrirLogin = document.getElementById('abrir-login');
  const fecharLogin = document.getElementById('fechar-login');
  const abrirRegistro = document.getElementById('abrir-registro');
  const fecharRegistro = document.getElementById('fechar-registro');
  const voltarLogin = document.getElementById('voltar-login');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  function openLogin() {
    if (modalRegistro) modalRegistro.classList.remove('ativo');
    if (modalLogin) {
      modalLogin.classList.add('ativo');
      const emailInput = document.getElementById('login-email');
      if (emailInput) setTimeout(() => emailInput.focus(), 100);
    }
  }

  function closeLogin() {
    if (modalLogin) modalLogin.classList.remove('ativo');
  }

  function openRegistro() {
    if (modalLogin) modalLogin.classList.remove('ativo');
    if (modalRegistro) {
      modalRegistro.classList.add('ativo');
      const nomeInput = document.getElementById('registro-nome');
      if (nomeInput) setTimeout(() => nomeInput.focus(), 100);
    }
  }

  function closeRegistro() {
    if (modalRegistro) modalRegistro.classList.remove('ativo');
  }

  if (abrirLogin) abrirLogin.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });
  if (fecharLogin) fecharLogin.addEventListener('click', closeLogin);
  if (abrirRegistro) abrirRegistro.addEventListener('click', (e) => { e.preventDefault(); openRegistro(); });
  if (fecharRegistro) fecharRegistro.addEventListener('click', closeRegistro);
  if (voltarLogin) voltarLogin.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });

  // Fechar ao clicar no backdrop
  [modalLogin, modalRegistro].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('ativo');
        }
      });
    }
  });

  // Fechar no ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLogin();
      closeRegistro();
    }
  });

  // Form Login
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      const senha = document.getElementById('login-senha')?.value;
      const submitBtn = formLogin.querySelector('button[type="submit"]');

      if (!email || !senha) {
        showToast('Preencha email e senha.', 'aviso');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const resp = await authApi.login(email, senha);
        showToast('Login realizado com sucesso!', 'sucesso');
        closeLogin();
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(resp);
        } else {
          window.location.href = '/aluno.html';
        }
      } catch (err) {
        showToast(err.message || 'Erro ao realizar login.', 'erro');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Form Registro
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('registro-nome')?.value?.trim();
      const email = document.getElementById('registro-email')?.value?.trim();
      const senha = document.getElementById('registro-senha')?.value;
      const submitBtn = formRegistro.querySelector('button[type="submit"]');

      if (!nome || !email || !senha) {
        showToast('Preencha todos os campos.', 'aviso');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const resp = await authApi.cadastrar(nome, email, senha);
        showToast('Conta criada com sucesso! Redirecionando...', 'sucesso');
        closeRegistro();
        if (typeof onRegisterSuccess === 'function') {
          onRegisterSuccess(resp);
        } else {
          window.location.href = '/aluno.html';
        }
      } catch (err) {
        showToast(err.message || 'Erro ao realizar cadastro.', 'erro');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  return { openLogin, closeLogin, openRegistro, closeRegistro };
}
