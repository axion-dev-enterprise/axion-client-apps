// api/_consumer-auth.js
// Middleware de autenticação compartilhado para todos os endpoints da API Parceiro Consumer

/**
 * Valida o token de acesso enviado pelo Consumer Desktop.
 * O Consumer envia o token no header Authorization: Bearer <token>
 * ou no campo token do body/query.
 *
 * @param {Object} req - Request object
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateConsumerToken(req) {
  const expectedToken = process.env.CONSUMER_API_TOKEN;

  // Se não há token configurado no servidor, bloqueia por segurança
  if (!expectedToken) {
    return { valid: false, reason: "CONSUMER_API_TOKEN não configurado no servidor." };
  }

  // 1. Tenta extrair do header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"] || req.headers["Authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token === expectedToken) return { valid: true };
    return { valid: false, reason: "Token inválido no header Authorization." };
  }

  // 2. Tenta extrair do header x-consumer-token, x-api-key ou xapikey (Consumer Desktop)
  const headerToken = req.headers["x-consumer-token"]
    || req.headers["x-api-key"]
    || req.headers["xapikey"];      // Consumer Desktop envia sem hífen
  if (headerToken && headerToken.trim() === expectedToken) return { valid: true };

  // 3. Tenta extrair do query string (?token=...)
  const queryToken = (req.query || {}).token;
  if (queryToken && queryToken.trim() === expectedToken) return { valid: true };

  // 4. Tenta extrair do body (?body.token=...)
  const bodyToken = (req.body || {}).token;
  if (bodyToken && bodyToken.trim() === expectedToken) return { valid: true };

  return { valid: false, reason: "Token de acesso ausente ou inválido." };
}

module.exports = { validateConsumerToken };
