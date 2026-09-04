// Vercel serverless — Cria link de assinatura/preferência para o Clube da Pizza (Mercado Pago)
const MERCADOPAGO_PREFERENCES_API = "https://api.mercadopago.com/checkout/preferences";

module.exports = async (req, res) => {
  // Configuração CORS
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[create-subscription] MERCADOPAGO_ACCESS_TOKEN not set");
    return res.status(500).json({ error: "missing_mercadopago_token" });
  }

  const { payerEmail, payerName } = req.body || {};
  const hostOrigin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : "https://annetom.com");
  const successUrl = `${hostOrigin}/confirmacao?club_status=success`;
  const failureUrl = `${hostOrigin}/checkout?status=erro`;
  const pendingUrl = `${hostOrigin}/confirmacao?club_status=pending`;
  const notificationUrl = `${hostOrigin}/api/pix-webhook`;

  try {
    const mpResponse = await fetch(MERCADOPAGO_PREFERENCES_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: "Assinatura Clube da Pizza Anne & Tom (Mensal)",
            description: "Benefícios exclusivos: 1 Esfirra Prestígio/mês, 1 Borda Vulcão/mês, 1 Frete Grátis/mês e Descontos VIP.",
            quantity: 1,
            unit_price: 129.90,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: payerEmail || "cliente@annetom.com.br",
          ...(payerName ? { name: payerName } : {}),
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: "approved",
        notification_url: notificationUrl,
        statement_descriptor: "CLUBE_ANNE_TOM",
        external_reference: `club_sub_${Date.now()}`,
      }),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("[create-subscription] MP error:", mpResponse.status, mpData);
      return res.status(mpResponse.status).json({
        error: mpData?.message || mpData?.error || "mercadopago_error",
        details: mpData,
      });
    }

    return res.status(201).json({
      id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
      checkoutUrl: mpData.init_point || null,
      provider: "mercadopago",
    });
  } catch (err) {
    console.error("[create-subscription] network error:", err);
    return res.status(502).json({ error: "upstream_unavailable", message: err.message });
  }
};
