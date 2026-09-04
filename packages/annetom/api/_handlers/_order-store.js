// api/_order-store.js
// Armazenamento unificado de pedidos em nuvem (GitHub Gist REST API) para Vercel Serverless & Programa Consumer POS

const GIST_ID = process.env.GH_GIST_ID || "0bf41ee88a9258a258a75cef31cea96d";
const GIST_TOKEN = process.env.GH_GIST_TOKEN || "";
const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;

// Cache em memória local para acelerar leituras no mesmo processo Lambda
const globalOrdersMap = global.__ANNETOM_ORDERS_MAP__ || new Map();
global.__ANNETOM_ORDERS_MAP__ = globalOrdersMap;

/**
 * Busca estado atual dos pedidos salvos no GitHub Gist
 */
async function fetchCloudState() {
  try {
    const freshUrl = `${GIST_URL}?t=${Date.now()}`;
    const res = await fetch(freshUrl, {
      headers: {
        "Authorization": `Bearer ${GIST_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "AnneTomPOS"
      },
      cache: "no-store"
    });
    if (res.ok) {
      const gist = await res.json();
      const rawContent = gist?.files?.["orders.json"]?.content;
      if (rawContent) {
        return JSON.parse(rawContent);
      }
    }
  } catch (err) {
    console.warn("[OrderStore] Erro ao ler cloud state do Gist:", err.message);
  }
  return { pendingIds: [], ordersMap: {} };
}

/**
 * Atualiza o estado dos pedidos no GitHub Gist
 */
async function updateCloudState(state) {
  try {
    const res = await fetch(GIST_URL, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${GIST_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "AnneTomPOS"
      },
      body: JSON.stringify({
        files: {
          "orders.json": {
            content: JSON.stringify(state, null, 2)
          }
        }
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[OrderStore] Erro ao atualizar cloud state no Gist:", err.message);
  }
  return null;
}

/**
 * Salva um novo pedido no cloud store e em memória
 * ENFORCES: Trava de liberação para pagamentos PIX / Cartão Online até aprovação do Webhook
 */
async function saveOrder(orderData) {
  const orderId = orderData.id || orderData.displayCode || `AT-${Math.floor(1000 + Math.random() * 9000)}`;
  const cleanId = String(orderId).trim();
  const now = new Date().toISOString();

  const methodRaw = String(orderData.payment?.method || orderData.pagamento || orderData.paymentMethod || "PIX").toUpperCase();
  const isOnlinePayment = methodRaw.includes("PIX") || methodRaw.includes("ONLINE") || methodRaw.includes("CREDIT") || methodRaw.includes("CARTAO_ONLINE");
  const isExplicitApproved = orderData.paymentStatus === "approved" || orderData.payment?.status === "approved" || orderData.paymentStatus === "paid";
  
  // Regra de Segurança: Dinheiro/Maquininha na entrega é aprovado no ato ("approved"); PIX/Cartão online exige confirmação via webhook ("pending").
  const initialPaymentStatus = isExplicitApproved ? "approved" : (isOnlinePayment ? "pending" : "approved");
  const initialOrderStatus = initialPaymentStatus === "pending" ? "awaiting_payment" : "open";

  const formattedOrder = {
    id: cleanId,
    displayCode: String(orderData.displayCode || cleanId).replace("AT-", ""),
    status: orderData.status || initialOrderStatus,
    paymentStatus: initialPaymentStatus,
    paymentMethod: methodRaw,
    consumerStatus: "PLACED",
    createdAt: orderData.createdAt || now,
    updatedAt: now,
    customer: {
      id: orderData.customer?.phone || orderData.customer?.id || orderData.dados?.phone || cleanId,
      name: orderData.customer?.name || orderData.dados?.name || "Cliente Site",
      phone: orderData.customer?.phone || orderData.dados?.phone || "",
      documentNumber: orderData.customer?.cpf || orderData.customer?.documentNumber || orderData.dados?.cpf || ""
    },
    deliveryAddress: {
      street: orderData.address?.street || orderData.dados?.rua || "Rua Principal",
      number: String(orderData.address?.number || orderData.dados?.numero || "100"),
      neighborhood: orderData.address?.neighborhood || orderData.dados?.bairro || "Imirim",
      city: orderData.address?.city || orderData.dados?.cidade || "São Paulo",
      state: orderData.address?.state || orderData.dados?.uf || "SP",
      postalCode: orderData.address?.postalCode || orderData.dados?.cep || "02012000",
      complement: orderData.address?.complement || orderData.dados?.complemento || ""
    },
    payments: [
      {
        name: methodRaw,
        code: methodRaw,
        status: initialPaymentStatus,
        value: Number(orderData.totals?.finalTotal || orderData.totals?.final_total || orderData.totalFinal || orderData.total?.orderAmount || (typeof orderData.total === "number" ? orderData.total : 85.00)),
        prepaid: isOnlinePayment
      }
    ],
    items: Array.isArray(orderData.items) ? orderData.items.map((it, idx) => ({
      id: String(it.id || it.productId || `ITEM-${idx}`),
      name: it.name || it.nome || it.title || "Pizza",
      quantity: Number(it.quantity || it.qtd || it.qty || 1),
      price: Number(it.price || it.unitPrice || it.preco || 0),
      totalPrice: Number(it.totalPrice || (it.price || it.unitPrice || 0) * (it.quantity || 1)),
      observations: it.observations || it.observacao || (it.border ? `Borda: ${it.border}` : "")
    })) : [],
    total: {
      subTotal: Number(orderData.totals?.subtotal || orderData.subtotal || orderData.total?.subTotal || orderData.total || 0),
      deliveryFee: Number(orderData.totals?.deliveryFee || orderData.taxaEntrega || orderData.delivery_fee || orderData.total?.deliveryFee || 0),
      discount: Number(orderData.totals?.discount || orderData.desconto || orderData.total?.discount || 0),
      orderAmount: Number(orderData.totals?.finalTotal || orderData.totals?.final_total || orderData.totalFinal || orderData.total?.orderAmount || (typeof orderData.total === "number" ? orderData.total : 85.00))
    }
  };

  // 1. Grava na memória local
  globalOrdersMap.set(cleanId, formattedOrder);

  // 2. Sincroniza atômico no Gist
  try {
    const cloudState = await fetchCloudState();
    const ordersMap = cloudState.ordersMap || {};
    let pendingIds = cloudState.pendingIds || [];

    ordersMap[cleanId] = formattedOrder;
    if (!pendingIds.includes(cleanId)) {
      pendingIds.push(cleanId);
    }

    const res = await updateCloudState({ pendingIds, ordersMap });
    console.log(`[OrderStore] Pedido ${cleanId} salvo. Tipo: ${methodRaw} | PaymentStatus: ${initialPaymentStatus} | Gist OK: ${!!res}`);
  } catch (err) {
    console.warn("[OrderStore] Erro ao sincronizar pedido com o Gist:", err.message);
  }

  return formattedOrder;
}

/**
 * Busca pedido por ID
 */
async function getOrderById(orderId) {
  if (!orderId) return null;
  const cleanId = String(orderId).trim();

  if (globalOrdersMap.has(cleanId)) {
    return globalOrdersMap.get(cleanId);
  }

  // Busca do Gist
  const cloudState = await fetchCloudState();
  const ordersMap = cloudState.ordersMap || {};

  const matchedKey = Object.keys(ordersMap).find(
    (k) => k === cleanId || k.toUpperCase() === cleanId.toUpperCase() || `AT-${k}` === cleanId
  );

  if (matchedKey && ordersMap[matchedKey]) {
    globalOrdersMap.set(cleanId, ordersMap[matchedKey]);
    return ordersMap[matchedKey];
  }

  return null;
}

/**
 * Retorna todos os pedidos pendentes para o Polling do Consumer (/api/consumer-events)
 * REGRA DE SEGURANÇA CRÍTICA: Retém pedidos PIX/Cartão Online até aprovação do Webhook!
 */
async function getPendingEvents() {
  const pendingEvents = [];
  const cloudState = await fetchCloudState();
  const ordersMap = cloudState.ordersMap || {};
  const pendingIds = cloudState.pendingIds || [];
  const candidateIds = new Set([...pendingIds, ...Object.keys(ordersMap)]);

  // Atualiza mapa local
  for (const [id, order] of Object.entries(ordersMap)) {
    globalOrdersMap.set(id, order);
  }

  for (const id of candidateIds) {
    const order = ordersMap[id] || globalOrdersMap.get(id);
    if (!order) continue;

    const methodRaw = String(order.paymentMethod || order.payments?.[0]?.name || "PIX").toUpperCase();
    const isOnline = methodRaw.includes("PIX") || methodRaw.includes("ONLINE") || methodRaw.includes("CREDIT") || methodRaw.includes("CARTAO_ONLINE");
    const isPaid = order.paymentStatus === "approved" || order.paymentStatus === "paid" || (!isOnline);

    if (!isPaid) {
      console.log(`[OrderStore] Pedido ${id} RETIDO no Gateway: aguardando aprovação do webhook de pagamento (${methodRaw}).`);
      continue;
    }

    if (order.status === "open" || order.status === "pending" || order.consumerStatus === "PLACED") {
      pendingEvents.push({
        id: order.id,
        code: order.consumerStatus || "PLACED",
        fullCode: "ORDER_PLACED",
        createdAt: order.createdAt,
        orderId: order.id,
        displayCode: order.displayCode || order.id,
        total: order.total?.orderAmount || (typeof order.total === "number" ? order.total : 85.00)
      });
    }
  }

  return pendingEvents;
}

/**
 * Atualiza o status de pagamento de um pedido (chamado quando o Webhook confirma o PIX ou Cartão)
 */
async function updateOrderPaymentStatus(orderId, paymentStatus, details = {}) {
  const order = await getOrderById(orderId);
  if (!order) return { success: false, reason: "Order not found" };

  order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();
  if (order.payments && order.payments[0]) {
    order.payments[0].status = paymentStatus;
  }

  if (paymentStatus === "approved" || paymentStatus === "paid") {
    order.status = "open";
    order.consumerStatus = "PLACED";
  } else if (paymentStatus === "rejected" || paymentStatus === "cancelled") {
    order.status = "cancelled";
    order.consumerStatus = "CANCELLED";
  }

  try {
    const cloudState = await fetchCloudState();
    const ordersMap = cloudState.ordersMap || {};
    let pendingIds = cloudState.pendingIds || [];

    ordersMap[order.id] = order;

    // Se aprovado, garante que o ID está na fila de despachos pendentes para ser enviado ao Consumer POS
    if ((paymentStatus === "approved" || paymentStatus === "paid") && !pendingIds.includes(order.id)) {
      pendingIds.push(order.id);
    } else if (paymentStatus === "rejected" || paymentStatus === "cancelled") {
      pendingIds = pendingIds.filter(id => id !== order.id);
    }

    await updateCloudState({ pendingIds, ordersMap });
    globalOrdersMap.set(order.id, order);
    console.log(`[OrderStore] Webhook Payment Status do pedido ${order.id}: ${paymentStatus}. Liberado para POS: ${paymentStatus === "approved"}`);
  } catch (err) {
    console.warn("[OrderStore] Erro ao sincronizar atualização de pagamento:", err.message);
  }

  return { success: true, order };
}

/**
 * Atualiza o status operacional de um pedido (ex: enviado pelo Consumer Desktop)
 */
async function updateStatus(orderId, newStatus, details) {
  const order = await getOrderById(orderId);
  if (order) {
    order.consumerStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    const statusMap = {
      "CONFIRMED": "confirmed",
      "IN_PREPARATION": "preparing",
      "READY_FOR_PICKUP": "ready",
      "DISPATCHED": "on_the_way",
      "DELIVERED": "delivered",
      "CANCELLED": "cancelled",
    };
    if (statusMap[newStatus]) {
      order.status = statusMap[newStatus];
    }

    // Se o pedido foi aceito ou finalizado, remove da lista de pendentes
    try {
      const cloudState = await fetchCloudState();
      const ordersMap = cloudState.ordersMap || {};
      let pendingIds = cloudState.pendingIds || [];

      ordersMap[orderId] = order;
      if (newStatus === "CONFIRMED" || newStatus === "CANCELLED" || newStatus === "DELIVERED") {
        pendingIds = pendingIds.filter(id => id !== orderId);
      }

      await updateCloudState({ pendingIds, ordersMap });
    } catch (e) {
      // ignore
    }

    return { success: true, order };
  }
  return { success: false, reason: "Order not found" };
}

module.exports = {
  saveOrder,
  getOrderById,
  getPendingEvents,
  updateOrderPaymentStatus,
  updateStatus,
  globalOrdersMap
};
