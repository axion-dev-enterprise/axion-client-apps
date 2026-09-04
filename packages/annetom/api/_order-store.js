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
    const res = await fetch(GIST_URL, {
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
 */
async function saveOrder(orderData) {
  const orderId = orderData.id || orderData.displayCode || `AT-${Math.floor(1000 + Math.random() * 9000)}`;
  const cleanId = String(orderId).trim();
  const now = new Date().toISOString();

  const formattedOrder = {
    id: cleanId,
    displayCode: String(orderData.displayCode || cleanId).replace("AT-", ""),
    status: orderData.status || "open",
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
        name: orderData.payment?.method || orderData.pagamento || "PIX",
        code: String(orderData.payment?.method || orderData.pagamento || "PIX").toUpperCase(),
        value: Number(orderData.totals?.finalTotal || orderData.totals?.final_total || orderData.totalFinal || orderData.total?.orderAmount || (typeof orderData.total === "number" ? orderData.total : 85.00)),
        prepaid: true
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
    console.log(`[OrderStore] Pedido ${cleanId} salvo no Gist com sucesso:`, !!res);
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
 */
async function getPendingEvents() {
  const pendingEvents = [];
  const cloudState = await fetchCloudState();
  const ordersMap = cloudState.ordersMap || {};
  const pendingIds = cloudState.pendingIds || [];

  // Atualiza mapa local
  for (const [id, order] of Object.entries(ordersMap)) {
    globalOrdersMap.set(id, order);
  }

  for (const id of pendingIds) {
    const order = ordersMap[id] || globalOrdersMap.get(id);
    if (order && (order.status === "open" || order.status === "pending" || order.consumerStatus === "PLACED")) {
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
 * Atualiza o status de um pedido
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
  updateStatus,
  globalOrdersMap
};
