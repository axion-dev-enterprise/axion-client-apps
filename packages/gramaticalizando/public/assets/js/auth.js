import { uuid, nowISO, isEmail } from './utils.js';
import { getUsers, findUserByEmail, createUser, saveSession, getSession, clearSession } from './storage.js';

const showMessage = (text, isError = false) => {
  let toast = document.getElementById('auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'auth-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1f1630;color:#fff;padding:12px 24px;border-radius:12px;font-size:0.95rem;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,0.25);z-index:9999;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);opacity:0;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.style.background = isError ? '#dc2626' : '#7c3aed';
  toast.textContent = text;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 3500);
};

const setLoadingState = (form, loading=true) => {
  const submitBtn = form.querySelector('#submitBtn');
  const btnText = form.querySelector('#btnText');
  const btnSpinner = form.querySelector('#btnSpinner');
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  if (btnSpinner) btnSpinner.classList.toggle('hidden', !loading);
  if (btnText) btnText.textContent = loading ? (form.id === 'loginForm' ? 'Entrando...' : 'Criando conta...') : (form.id === 'loginForm' ? 'Sign In' : 'Criar conta');
};

const registerHandler = (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  setLoadingState(form, true);

  const name = document.getElementById('nome')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const telefone = document.getElementById('telefone')?.value?.trim();
  const password = document.getElementById('password')?.value || '';
  const confirm = document.getElementById('confirmPassword')?.value || '';

  console.log('Registro - Nome:', name, 'Email:', email, 'Telefone:', telefone, 'Senha:', password.length, 'Confirm:', confirm.length);

  if (!name) { showMessage('Nome é obrigatório', true); setLoadingState(form,false); return; }
  if (!isEmail(email)) { showMessage('E-mail inválido', true); setLoadingState(form,false); return; }
  if (!telefone || telefone.length < 10) { showMessage('Telefone inválido (mínimo 10 dígitos)', true); setLoadingState(form,false); return; }
  if (password.length < 8) { showMessage('Senha mínima 8 caracteres', true); setLoadingState(form,false); return; }
  if (password !== confirm) { showMessage('Senhas não coincidem', true); setLoadingState(form,false); return; }
  if (findUserByEmail(email)) { showMessage('E-mail já cadastrado', true); setLoadingState(form,false); return; }

  const user = {
    id: uuid(),
    nome: name,
    email,
    telefone,
    senha: password,
    criadoEm: nowISO(),
    tipo: 'cliente'
  };

  console.log('Usuário criado:', user);
  createUser(user);
  console.log('Usuarios no localStorage:', getUsers());
  showMessage('Conta criada com sucesso! Redirecionando...');
  setTimeout(() => {
    window.location.href = './login.html';
  }, 1000);
};

const loginHandler = (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  setLoadingState(form, true);
  const email = document.getElementById('email')?.value?.trim();
  const password = document.getElementById('password')?.value || '';
  
  console.log('Login - Email:', email, 'Senha:', password.length);
  console.log('Usuarios no localStorage:', getUsers());
  
  if (!isEmail(email)) { showMessage('E-mail inválido', true); setLoadingState(form,false); return; }
  const user = findUserByEmail(email);
  console.log('Usuario encontrado:', user);
  
  if (!user) { showMessage('Usuário não encontrado', true); setLoadingState(form,false); return; }
  if (user.senha !== password) { showMessage('Senha inválida', true); setLoadingState(form,false); return; }
  saveSession({ id: user.id, nome: user.nome, email: user.email, tipo: user.tipo, criadoEm: user.criadoEm });
  console.log('Sessão salva, redirecionando...');
  if (user.tipo === 'professor') {
    window.location.href = '../professor/index.html';
  } else {
    const diagnostico = localStorage.getItem('diagnostico_simples');
    if (diagnostico) {
      window.location.href = './home.html';
    } else {
      window.location.href = './diagnostico.html';
    }
  }
};

const logout = () => {
  clearSession();
  window.location.href = '/pages/login.html';
};

const setupPasswordToggle = () => {
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  if (!togglePasswordBtn || !passwordInput) return;
  togglePasswordBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  });
};

// attach handlers if forms exist
window.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 DOMContentLoaded - auth.js carregado');
  
  const registerForm = document.getElementById('registroForm');
  console.log('📋 Formulário de registro encontrado?', !!registerForm);
  if (registerForm) {
    console.log('✅ Adicionando listener ao formulário de registro');
    registerForm.addEventListener('submit', registerHandler);
  }

  const loginForm = document.getElementById('loginForm');
  console.log('📋 Formulário de login encontrado?', !!loginForm);
  if (loginForm) {
    console.log('✅ Adicionando listener ao formulário de login');
    loginForm.addEventListener('submit', loginHandler);
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  setupPasswordToggle();

  // expose for console/debug
  window.auth = { registerHandler, loginHandler, logout };
});
