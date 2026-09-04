// api/consumer-status.js
// Endpoint para receber atualizações de status do pedido enviadas pelo Consumer Desktop

const { validateConsumerToken } = require("./_consumer-auth");
const { updateStatus } = require("./_order-store");
const { captureRequest, saveLog } = require("./_logger");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-consumer-token, x-api-key");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Loga tudo que o Consumer Desktop enviou
  const logEntry = captureRequest(req, "consumer-status");
  saveLog(logEntry).catch(() => {}); // fire-and-forget

  // Validação do token de acesso
  const auth = validateConsumerToken(req);
  if (!auth.valid) {
    console.warn("[ConsumerStatus] Token inválido:", auth.reason);
    return res.status(401).json({ error: "unauthorized", message: auth.reason });
  }

  try {
    const body = req.body || {};

    const orderId = body.orderId || body.order_id || body.id;
    const statusCode = body.code || body.status || body.statusCode;
    const details = body.details || body.message || null;

    if (!orderId || !statusCode) {
      return res.status(200).json({
        success: true,
        message: "Endpoint de status ativo e pronto."
      });
    }

    const result = await updateStatus(orderId, statusCode, details);
    console.log(`[ConsumerStatus] Pedido ${orderId} -> ${statusCode}`);

    return res.status(200).json({
      success: true,
      orderId,
      consumerStatus: statusCode,
      internalStatus: result.order?.status || statusCode,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ConsumerStatus] Erro ao atualizar status:", err.message);
    return res.status(500).json({ error: "internal_server_error", message: err.message });
  }
};
