// src/services/consumerService.js
// Módulo de integração unificado com a API do Programa Consumer POS & AXION PDV

const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  
  // Em produção no domínio annetom.com ou pdv.axionenterprise.cloud
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('axionenterprise.cloud')) {
      return 'https://pdv.axionenterprise.cloud/api';
    }
  }
  return 'https://annetom.com/api';
};

/**
 * Realiza requisições HTTP autenticadas para o gateway da API Consumer/PDV
 */
const consumerFetch = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const token = localStorage.getItem('CONSUMER_API_TOKEN') || process.env.REACT_APP_CONSUMER_API_TOKEN || '';
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 
      'Authorization': `Bearer ${token}`,
      'x-consumer-token': token,
      'x-api-key': token,
      'xapikey': token
    } : {}),
    ...(options.headers || {})
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Erro HTTP ${response.status}`);
  }

  return response.json();
};

export const consumerService = {
  getApiBaseUrl,

  // Health check do gateway
  checkHealth: async () => {
    const start = Date.now();
    try {
      const data = await consumerFetch('/health');
      return {
        success: true,
        latencyMs: Date.now() - start,
        data
      };
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: err.message
      };
    }
  },

  // Consulta eventos pendentes para o Consumer POS
  fetchPendingEvents: async () => {
    return consumerFetch('/consumer-events');
  },

  // Consulta detalhes de um pedido por ID
  fetchOrderDetails: async (orderId) => {
    return consumerFetch(`/consumer-order?id=${encodeURIComponent(orderId)}`);
  },

  // Atualiza status do pedido (CONFIRMED, PREPARING, READY, DISPATCHED, DELIVERED, CANCELLED)
  updateOrderStatus: async (orderId, status) => {
    return consumerFetch('/consumer-status', {
      method: 'POST',
      body: JSON.stringify({
        id: orderId,
        status,
        updatedAt: new Date().toISOString()
      })
    });
  },

  // Busca logs de requisições enviadas pelo Consumer POS
  fetchLogs: async () => {
    return consumerFetch('/consumer-logs');
  },

  // Limpa o histórico de logs do Consumer
  clearLogs: async () => {
    return consumerFetch('/consumer-logs', { method: 'DELETE' });
  }
};

export default consumerService;
