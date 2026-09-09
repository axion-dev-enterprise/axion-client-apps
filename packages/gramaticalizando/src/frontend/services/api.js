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
  cadastrar: (nome, email, senha) => apiRequest('/api/cadastrar', { method: 'POST', body: { nome, email, senha } }),
  me: () => apiRequest('/api/sessao'),
  logout: () => apiRequest('/api/logout', { method: 'POST' }),
  adminLogin: (usuario, senha) => apiRequest('/api/admin/login', { method: 'POST', body: { usuario, senha } })
};

export const diagnosticoApi = {
  obterPerguntas: () => apiRequest('/api/diagnostico/perguntas'),
  submeter: (respostas) => apiRequest('/api/diagnostico/submeter', { method: 'POST', body: { respostas } }),
  salvarResultado: (resultado) => apiRequest('/api/diagnostico/resultado', { method: 'POST', body: resultado })
};

export const alunoApi = {
  dados: () => apiRequest('/api/aluno/dados'),
  materias: () => apiRequest('/api/materias'),
  aulas: (materiaId) => apiRequest(`/api/aulas${materiaId ? `?materia=${materiaId}` : ''}`),
  exercicios: (materiaId) => apiRequest(`/api/exercicios${materiaId ? `?materia=${materiaId}` : ''}`),
  responderExercicio: (exercicioId, resposta) => apiRequest('/api/exercicio/responder', {
    method: 'POST',
    body: { exercicioId, resposta }
  }),
  concluirAula: (aulaId) => apiRequest('/api/aula/concluir', {
    method: 'POST',
    body: { aulaId }
  })
};

export const redacaoApi = {
  enviar: (tema, texto) => apiRequest('/api/redacao/enviar', {
    method: 'POST',
    body: { tema, texto }
  }),
  historico: () => apiRequest('/api/redacao/historico')
};
