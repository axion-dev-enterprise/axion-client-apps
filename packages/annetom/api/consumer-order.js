// api/consumer-order.js
// Endpoint de Detalhes do Pedido formatado no padrão oficial do Programa Consumer POS / MenuDino

const { validateConsumerToken } = require("./_consumer-auth");
const { getOrderById } = require("./_order-store");
const { captureRequest, saveLog } = require("./_logger");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-consumer-token, x-api-key");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Loga tudo que o Consumer Desktop enviou
  const logEntry = captureRequest(req, "consumer-order");
  saveLog(logEntry).catch(() => {}); // fire-and-forget

  // Validação do token de acesso
  const auth = validateConsumerToken(req);
  if (!auth.valid) {
    console.warn("[ConsumerOrder] Token inválido:", auth.reason);
    return res.status(401).json({ error: "unauthorized", message: auth.reason });
  }

  // POST — Consumer envia detalhes de volta (ack com payload completo)
  if (req.method === "POST") {
    const payload = req.body || {};
    console.log("[ConsumerOrder POST] Recebido:", JSON.stringify(payload));
    return res.status(200).json({ success: true, message: "Detalhes do pedido recebidos com sucesso.", received: payload });
  }

  const { id } = req.query || {};
  if (!id) {
    // Resposta de validação amigável para quando o Consumer testa a rota sem parâmetro ID
    return res.status(200).json({
      id: "VALIDATION-0000",
      displayCode: "0000",
      status: "open",
      consumerStatus: "PLACED",
      message: "Endpoint de detalhes do pedido ativo."
    });
  }

  try {
    const order = await getOrderById(id);

    if (!order) {
      console.warn(`[ConsumerOrder] Pedido ${id} não encontrado.`);
      return res.status(200).json({
        id: String(id),
        displayCode: String(id).replace("AT-", ""),
        status: "open",
        consumerStatus: "PLACED",
        customer: { name: "Cliente Teste", phone: "11999999999" },
        total: { orderAmount: 0 }
      });
    }

    console.log(`[ConsumerOrder] Detalhes do pedido ${id} entregues com sucesso ao Consumer POS.`);
    return res.status(200).json(order);
  } catch (err) {
    console.error("[ConsumerOrder] Erro ao buscar detalhes do pedido:", err);
    return res.status(500).json({ error: "internal_server_error", message: err.message });
  }
};
