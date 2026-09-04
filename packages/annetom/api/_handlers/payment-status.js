// api/payment-status.js
// Endpoint serverless para consultar ou atualizar o status de pagamento de um pedido
const { getOrderById, updateOrderPaymentStatus } = require("./_order-store");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/payment-status?id=AT-1234 -> Consulta status do pagamento p/ polling do checkout
  if (req.method === "GET") {
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: "missing_id", message: "Informe o ID do pedido (ex: ?id=AT-1234)." });
    }

    try {
      const order = await getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: "not_found", message: `Pedido ${id} não encontrado.` });
      }

      return res.status(200).json({
        orderId: order.id,
        displayCode: order.displayCode,
        paymentStatus: order.paymentStatus || "pending",
        paymentMethod: order.paymentMethod || "PIX",
        orderStatus: order.status,
        consumerStatus: order.consumerStatus,
        total: order.total?.orderAmount || 0,
        updatedAt: order.updatedAt
      });
    } catch (err) {
      console.error("[PaymentStatus GET] Erro ao buscar status:", err);
      return res.status(500).json({ error: "internal_server_error", message: err.message });
    }
  }

  // POST /api/payment-status -> Atualização de status vinda de gateway de pagamento ou webhook
  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const orderId = body.orderId || body.order_id || body.id;
      const status = body.status || body.paymentStatus || body.payment_status;

      if (!orderId || !status) {
        return res.status(400).json({ error: "missing_fields", message: "orderId e status são obrigatórios." });
      }

      const result = await updateOrderPaymentStatus(orderId, status, body);

      if (!result.success) {
        return res.status(404).json({ error: "not_found", message: result.reason });
      }

      return res.status(200).json({
        success: true,
        orderId: result.order.id,
        paymentStatus: result.order.paymentStatus,
        orderStatus: result.order.status,
        message: `Status de pagamento do pedido ${orderId} atualizado para ${status}.`
      });
    } catch (err) {
      console.error("[PaymentStatus POST] Erro ao atualizar status:", err);
      return res.status(500).json({ error: "internal_server_error", message: err.message });
    }
  }

  return res.status(405).json({ error: "method_not_allowed" });
};
