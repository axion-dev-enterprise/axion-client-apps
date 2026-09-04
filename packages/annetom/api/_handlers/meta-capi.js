// Vercel Serverless Function — Meta Conversions API (CAPI)
// Envia eventos diretamente para a Graph API do Facebook (Pixel: 7730761056949728)

const PIXEL_ID = process.env.META_PIXEL_ID || "7730761056949728";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN; // Fallback or Meta Token

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const { eventName, eventSourceUrl, userData = {}, customData = {} } = req.body || {};

    if (!eventName) {
      return res.status(400).json({ error: "eventName_required" });
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: eventSourceUrl || "https://annetom.com",
          action_source: "website",
          user_data: {
            client_ip_address: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1",
            client_user_agent: req.headers["user-agent"] || "",
            em: userData.email ? [cryptoHash(userData.email)] : undefined,
            ph: userData.phone ? [cryptoHash(userData.phone)] : undefined,
          },
          custom_data: customData,
        },
      ],
    };

    const token = process.env.META_CAPI_TOKEN || process.env.META_ACCESS_TOKEN;
    if (!token) {
      console.log(`[meta-capi] Evento ${eventName} registrado localmente (Token CAPI opcional).`);
      return res.status(200).json({ status: "logged_locally", eventName });
    }

    const graphRes = await fetch(`https://graph.facebook.net/v19.0/${PIXEL_ID}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const graphData = await graphRes.json().catch(() => ({}));
    return res.status(200).json({ status: "success", eventName, response: graphData });
  } catch (err) {
    console.error("[meta-capi] Erro ao enviar evento CAPI:", err);
    return res.status(200).json({ status: "error", error: err.message });
  }
};

function cryptoHash(text) {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(String(text).trim().toLowerCase()).digest("hex");
}
