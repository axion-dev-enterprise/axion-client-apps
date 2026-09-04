/**
 * Helper unificado para disparar todos os Eventos de Conversão do Meta Pixel (Pixel ID: 7730761056949728)
 * Suporta: PageView, ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase, Contact, Subscribe.
 */

export function trackPixelEvent(eventName, params = {}) {
  try {
    // 1. Client-Side Browser Pixel (fbq)
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", eventName, params);
      console.log(`[MetaPixel:7730761056949728] Evento '${eventName}' disparado:`, params);
    }

    // 2. Server-Side Conversions API (CAPI) Dual Dispatch
    if (typeof window !== "undefined" && window.fetch) {
      window.fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          eventSourceUrl: window.location.href,
          customData: params,
        }),
      }).catch(() => null); // Silent fallback
    }
  } catch (err) {
    console.warn(`[MetaPixel] Erro ao disparar evento '${eventName}':`, err);
  }
}

/** Dispara evento de navegação de página (PageView) */
export function trackPageView(pageName = "") {
  trackPixelEvent("PageView", { page: pageName || window.location.pathname });
}

/** Dispara visualização de item/pizza específica (ViewContent) */
export function trackViewContent({ item, currency = "BRL" }) {
  if (!item) return;
  const sku = item.id ? `AT-${item.id}` : undefined;
  trackPixelEvent("ViewContent", {
    content_name: item.nome || item.name || "Pizza Anne & Tom",
    content_category: item.categoria || "Pizzas Gourmet",
    content_ids: sku ? [sku] : [],
    content_type: "product",
    value: Number(item.preco_grande || item.preco || 0),
    currency,
  });
}

/** Dispara adição ao carrinho (AddToCart) */
export function trackAddToCart({ item, quantidade = 1, tamanho = "grande", currency = "BRL" }) {
  if (!item) return;
  const rawId = item.id || item.idPizza || "000";
  const sku = `AT-${rawId}-${tamanho === "broto" ? "B" : "G"}`;
  const precoUnitario = Number(item.precoUnitario || item.preco || item.preco_grande || 0);

  trackPixelEvent("AddToCart", {
    content_name: `${item.nome || item.name || "Pizza"} (${tamanho})`,
    content_type: "product",
    content_ids: [sku],
    value: precoUnitario * quantidade,
    currency,
    num_items: quantidade,
  });
}

/** Dispara início do checkout (InitiateCheckout) */
export function trackInitiateCheckout({ totalFinal, items = [], itemsCount = 0, currency = "BRL" }) {
  const contentIds = items
    .map((i) => {
      const rawId = i.id || i.idPizza || "000";
      const sizeTag = i.tamanho === "broto" ? "B" : "G";
      return `AT-${rawId}-${sizeTag}`;
    })
    .filter(Boolean);

  trackPixelEvent("InitiateCheckout", {
    value: Number(totalFinal || 0),
    currency,
    num_items: Number(itemsCount || items.length || 0),
    content_type: "product",
    content_ids: contentIds,
  });
}

/** Dispara seleção/adicionamento de forma de pagamento (AddPaymentInfo) */
export function trackAddPaymentInfo({ paymentMethod, totalFinal, currency = "BRL" }) {
  trackPixelEvent("AddPaymentInfo", {
    payment_category: paymentMethod || "cartao",
    value: Number(totalFinal || 0),
    currency,
  });
}

/** Dispara compra finalizada (Purchase) */
export function trackPurchase({ orderId, totalFinal, items = [], currency = "BRL" }) {
  const contentIds = items
    .map((i) => {
      const rawId = i.id || i.idPizza || "000";
      const sizeTag = i.tamanho === "broto" ? "B" : "G";
      return `AT-${rawId}-${sizeTag}`;
    })
    .filter(Boolean);

  trackPixelEvent("Purchase", {
    value: Number(totalFinal || 0),
    currency,
    content_type: "product",
    content_ids: contentIds,
    num_items: items.length,
    order_id: orderId || "pedido-annetom",
  });
}

/** Dispara contato via WhatsApp ou telefone (Contact) */
export function trackContact({ method = "WhatsApp" }) {
  trackPixelEvent("Contact", { method });
}

/** Dispara assinatura do Clube da Pizza (Subscribe) */
export function trackSubscribe({ planName = "Clube da Pizza", value = 69.90, currency = "BRL" }) {
  trackPixelEvent("Subscribe", {
    predicted_ltv: value * 12,
    value,
    currency,
    subscription_id: "clube-pizza-mensal",
  });
}
