// src/utils/analytics.js
// Utilitário de Rastreamento E-Commerce GA4 e Meta Pixel / CAPI

export const trackEvent = (eventName, params = {}) => {
  try {
    // 1. Google Analytics 4 (gtag)
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }

    // 2. Meta Pixel (fbq)
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, params);
    }
  } catch (err) {
    console.warn("[Analytics] Falha ao enviar evento:", err);
  }
};

export const trackAddToCart = (item) => {
  trackEvent("add_to_cart", {
    currency: "BRL",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: 1,
      },
    ],
  });
};

export const trackBeginCheckout = (cartItems, total) => {
  trackEvent("begin_checkout", {
    currency: "BRL",
    value: total,
    items: cartItems.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity || 1,
    })),
  });
};

export const trackPurchase = (orderId, total, items = []) => {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: total,
    currency: "BRL",
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity || 1,
    })),
  });
};
