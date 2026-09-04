// api/create-order.js
// Endpoint serverless para receber e registrar pedidos do checkout do site Anne & Tom

const { saveOrder } = require("./_order-store");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const payload = req.body || {};
    console.log("[CreateOrder API] Recebido novo pedido:", JSON.stringify(payload).slice(0, 300));

    const savedOrder = await saveOrder(payload);

    console.log(`[CreateOrder API] Pedido ${savedOrder.id} salvo com sucesso!`);

    return res.status(201).json({
      success: true,
      ok: true,
      status: 201,
      data: savedOrder,
      order: savedOrder,
      orderId: savedOrder.id,
      trackingId: savedOrder.id,
      message: "Pedido registrado com sucesso e disponibilizado para o Programa Consumer POS."
    });
  } catch (err) {
    console.error("[CreateOrder API] Erro ao registrar pedido:", err);
    return res.status(500).json({ error: "internal_server_error", message: err.message });
  }
};
