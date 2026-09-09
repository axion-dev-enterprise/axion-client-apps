/**
 * AXION Client Apps - Gramaticalizando
 * Canonical API Service Client (ESM)
 */

export async function apiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(endpoint, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.erro || data.mensagem || `HTTP error ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  login: (email, senha) => apiRequest('/api/login', { method: 'POST', body: { email, senha } }),
  cadastrar: (nome, email, senha) => apiRequest('/api/registro', { method: 'POST', body: { nome, email, senha } }),
  me: () => apiRequest('/api/me'),
  logout: () => apiRequest('/api/logout', { method: 'POST' }),
  adminLogin: (usuario, senha) => apiRequest('/api/admin/login', { method: 'POST', body: { usuario, senha } })
};

export const diagnosticoApi = {
  obterQuestoes: () => apiRequest('/api/aluno/diagnostico/questoes'),
  processar: (respostas) => apiRequest('/api/aluno/diagnostico/processar', {
    method: 'POST',
    body: { respostas }
  })
};

export const alunoApi = {
  obterDashboard: (alunoId) => apiRequest(`/api/dashboard/${encodeURIComponent(alunoId)}`),
  materias: () => apiRequest('/api/materias'),
  aulas: (materiaId) => apiRequest(`/api/aulas${materiaId ? `?materia=${materiaId}` : ''}`),
  exercicios: (materiaId) => apiRequest(`/api/exercicios${materiaId ? `?materia=${materiaId}` : ''}`)
};

export const redacaoApi = {
  obterTemas: () => apiRequest('/api/aluno/redacoes/temas'),
  obterRedacoes: () => apiRequest('/api/aluno/redacoes'),
  enviar: (dados) => apiRequest('/api/aluno/redacoes', {
    method: 'POST',
    body: dados
  })
};

