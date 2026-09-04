// Vercel serverless — Webhook para notificações de pagamento Mercado Pago
// Configurar no Mercado Pago: URL para https://anne-tom-react-site.vercel.app/api/pix-webhook
const crypto = require("crypto");

const MERCADOPAGO_API = "https://api.mercadopago.com/v1/payments";

/** Valida a assinatura x-signature do Mercado Pago se MERCADOPAGO_WEBHOOK_SECRET estiver configurado */
function verifyMercadoPagoSignature(req, dataId) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // Se o segredo não estiver definido no env, ignora a validação restritiva em dev

  const xSignature = req.headers["x-signature"];
  const xRequestId = req.headers["x-request-id"];
  if (!xSignature || !xRequestId) return false;

  const parts = String(xSignature).split(",");
  let ts = "";
  let v1 = "";
  parts.forEach((part) => {
    const [key, val] = part.trim().split("=");
    if (key === "ts") ts = val;
    if (key === "v1") v1 = val;
  });

  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return hmac === v1;
}

module.exports = async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // Tratamento de testes de ping do Mercado Pago
  if (req.method === "GET") {
    return res.status(200).json({ status: "online", service: "annetom-pix-webhook" });
  }

  try {
    const { action, data, type } = req.body || {};
    const paymentId = data?.id || (req.query.topic === "payment" ? req.query.id : null);

    console.log(`[pix-webhook] Recebido evento: action=${action}, type=${type}, id=${paymentId}`);

    if (paymentId) {
      if (!verifyMercadoPagoSignature(req, paymentId)) {
        console.warn(`[pix-webhook] Assinatura inválida (x-signature) para o pagamento ${paymentId}`);
        return res.status(401).json({ error: "invalid_webhook_signature" });
      }

      const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (token) {
        const mpRes = await fetch(`${MERCADOPAGO_API}/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (mpRes.ok) {
          const paymentInfo = await mpRes.json();
          console.log(`[pix-webhook] Status do Pagamento ${paymentId}: ${paymentInfo.status} (${paymentInfo.status_detail})`);
          
          const externalRef = paymentInfo.external_reference;
          const status = paymentInfo.status; // approved, pending, rejected, etc.

          // Se tiver URL da API desktop, repassa o evento de pagamento
          const atApiUrl = process.env.REACT_APP_AT_API_BASE_URL || "https://api.annetom.com";
          if (externalRef && status === "approved") {
            try {
              await fetch(`${atApiUrl}/api/orders/${externalRef}/payment-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentId,
                  status: "approved",
                  provider: "mercadopago",
                  updatedAt: new Date().toISOString()
                })
              });
              console.log(`[pix-webhook] Pedido ${externalRef} atualizado para PAGO no backend!`);
            } catch (backendErr) {
              console.warn(`[pix-webhook] Não foi possível avisar backend local:`, backendErr.message);
            }

            // Disparo automático do CAPI Purchase para Meta Ads
            try {
              const metaCapiToken = process.env.META_CAPI_TOKEN;
              const pixelId = process.env.META_PIXEL_ID || "7730761056949728";
              if (metaCapiToken) {
                const capiPayload = {
                  data: [
                    {
                      event_name: "Purchase",
                      event_time: Math.floor(Date.now() / 1000),
                      event_source_url: "https://annetom.com/checkout",
                      action_source: "website",
                      user_data: {
                        client_ip_address: req.headers["x-forwarded-for"] || "127.0.0.1",
                        client_user_agent: req.headers["user-agent"] || "",
                        ph: paymentInfo.payer?.phone?.number ? [crypto.createHash("sha256").update(String(paymentInfo.payer.phone.number).trim()).digest("hex")] : undefined,
                        em: paymentInfo.payer?.email ? [crypto.createHash("sha256").update(String(paymentInfo.payer.email).trim().toLowerCase()).digest("hex")] : undefined
                      },
                      custom_data: {
                        value: Number(paymentInfo.transaction_amount || 0),
                        currency: "BRL",
                        order_id: externalRef || String(paymentId)
                      }
                    }
                  ]
                };
                await fetch(`https://graph.facebook.net/v19.0/${pixelId}/events?access_token=${metaCapiToken}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(capiPayload)
                });
                console.log(`[pix-webhook] Meta CAPI Purchase enviado para o pedido ${externalRef}`);
              }
            } catch (capiErr) {
              console.warn(`[pix-webhook] Erro ao enviar CAPI Purchase:`, capiErr.message);
            }
          }
        }
      }
    }

    return res.status(200).json({ received: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[pix-webhook] Erro de processamento:", err);
    return res.status(200).json({ received: true, error: err.message });
  }
};