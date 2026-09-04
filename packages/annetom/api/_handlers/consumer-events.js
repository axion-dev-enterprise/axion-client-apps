// api/consumer-events.js
// Endpoint oficial de Polling de Eventos do Programa Consumer / MenuDino

const { validateConsumerToken } = require("./_consumer-auth");
const { getPendingEvents } = require("./_order-store");
const { captureRequest, saveLog } = require("./_logger");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-consumer-token, x-api-key");

  if (req.method === "OPTIONS") {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).end();
  }

  const logEntry = captureRequest(req, "consumer-events");
  saveLog(logEntry).catch(() => {});

  const auth = validateConsumerToken(req);
  if (!auth.valid) {
    console.warn("[ConsumerEvents] Token inválido:", auth.reason, "| Headers:", JSON.stringify(req.headers));
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: "unauthorized", message: auth.reason });
  }

  try {
    if (req.method === "GET") {
      const pendingEvents = await getPendingEvents();
      console.log(`[ConsumerEvents] Polling recebido. Eventos pendentes: ${pendingEvents.length}`);

      const responseEvents = pendingEvents.map((evt) => ({
        id: evt.id,
        orderId: evt.orderId || evt.id,
        createdAt: evt.createdAt,
        fullCode: evt.fullCode || "ORDER_PLACED",
        code: evt.code || "PLC"
      }));

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        items: pendingEvents.length === 0 ? [] : responseEvents,
        statusCode: 0,
        reasonPhrase: null
      });
    }

    if (req.method === "POST") {
      console.log("[ConsumerEvents] ACK de eventos recebido do Consumer:", JSON.stringify(req.body));
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ status: "ok", message: "Eventos confirmados pelo Consumer." });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[ConsumerEvents] Erro:", err);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "internal_server_error", message: err.message });
  }
};
