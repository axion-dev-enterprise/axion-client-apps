/* eslint-disable no-unused-vars */
import axios from "axios";
import supabase from "../lib/supabase";

const runtimeConfig =
  typeof window !== "undefined"
    ? window.__ANNE_TOM_CONFIG__ || window.__APP_CONFIG__
    : undefined;
const apiKey = process.env.REACT_APP_AT_API_KEY;
const publicToken = process.env.REACT_APP_PUBLIC_API_TOKEN;
const authToken = apiKey || publicToken;

const atBaseUrl =
  process.env.REACT_APP_AT_API_BASE_URL || "https://api.annetom.com";
const normalizeBaseUrl = (base) => String(base || "").replace(/\/+$/, "");
const baseDomainUrl = normalizeBaseUrl(atBaseUrl).replace(/\/api$/, "");

const toResponse = (response) => ({
  ok: response.status >= 200 && response.status < 300,
  status: response.status,
  data: response.data,
  json: async () => response.data,
  text: async () =>
    typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data),
  headers: {
    get: (name) =>
      response.headers?.[String(name || "").toLowerCase()] || null,
  },
});

const toErrorResponse = (error) => ({
  ok: false,
  status: 0,
  error,
  json: async () => ({ error: String(error) }),
  text: async () => String(error),
  headers: {
    get: () => null,
  },
});

const normalizePayload = (payload) => {
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch (_err) {
      return payload;
    }
  }
  return payload;
};

/** Helper: chama um proxy same-origin e retorna resposta normalizada */
const callSameOriginProxy = async (path, payload, idempotencyKey) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
    const res = await fetch(path, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return {
      ok: res.ok,
      status: res.status,
      data,
      json: async () => data,
      text: async () => JSON.stringify(data),
      headers: { get: (name) => res.headers.get(name) },
    };
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

export const serverInstance = {
  baseDomain: {
    instance: axios.create({
      timeout: 15000,
      baseURL: baseDomainUrl,
      validateStatus: () => true,
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(authToken ? { "x-api-key": authToken } : {}),
        ...(!apiKey && !publicToken && runtimeConfig?.apiKey
          ? { Authorization: `Bearer ${runtimeConfig.apiKey}` }
          : {}),
      },
    }),
  },
};

const fetchStatus = async (id) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${id},display_code.eq.${id}`)
      .maybeSingle();

    if (error || !data) {
      try {
        const token = "370790c5d1f08bf32b27be7db5b949e95da2311a0a5713d82b8e9bcad4b09f71";
        const localRes = await fetch(`/api/consumer-order?id=${encodeURIComponent(id)}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (localRes.ok) {
          const localData = await localRes.json();
          return {
            ok: true,
            status: 200,
            data: localData,
            json: async () => localData,
            text: async () => JSON.stringify(localData),
          };
        }
      } catch (fallbackErr) {
        // fallback
      }

      const response = await serverInstance.baseDomain.instance.get(
        `/motoboy/pedido/${id}`
      );
      return toResponse(response);
    }
    return {
      ok: true,
      status: 200,
      data,
      json: async () => data,
      text: async () => JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

/* =========== SUPABASE: ENVIAR PEDIDO PARA O BANCO NATIVO =========== */
const enviarParaDesktop = async (params) => {
  try {
    const payload = normalizePayload(params);
    const { customer, items, totals, payment, delivery } = payload || {};

    const phoneDigits = String(customer?.phone || "").replace(/\D/g, "");
    let customerId = null;

    // 1. Garante o vínculo/criação do cliente no Supabase
    if (phoneDigits) {
      const { data: existingCust } = await supabase
        .from("customers")
        .select("id, points")
        .eq("phone", phoneDigits)
        .maybeSingle();

      if (existingCust) {
        customerId = existingCust.id;
      } else if (customer?.name) {
        const { data: newCust } = await supabase
          .from("customers")
          .insert({
            phone: phoneDigits,
            name: customer.name,
            email: customer.email || null,
            address_cep: delivery?.address?.cep || null,
            address_street: delivery?.address?.street || null,
            address_number: String(delivery?.address?.number || ""),
            address_complement: delivery?.address?.complement || null,
            address_neighborhood: delivery?.address?.neighborhood || null,
            address_city: delivery?.address?.city || "São Paulo",
            address_uf: delivery?.address?.state || "SP",
            points: 50,
          })
          .select("id")
          .single();
        if (newCust) customerId = newCust.id;
      }
    }

    const displayCode = `AT-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      id: displayCode,
      display_code: displayCode,
      status: "open",
      total: Number(totals?.finalTotal || totals?.subtotal || 0),
      delivery_fee: Number(totals?.deliveryFee || 0),
      customer: {
        id: customerId || null,
        name: customer?.name || "Cliente Site",
        phone: phoneDigits || "",
        email: customer?.email || null,
      },
      address: {
        street: delivery?.address?.street || "",
        number: String(delivery?.address?.number || ""),
        neighborhood: delivery?.address?.neighborhood || "",
        city: delivery?.address?.city || "São Paulo",
        state: delivery?.address?.state || "SP",
        postalCode: delivery?.address?.cep || "",
        complement: delivery?.address?.complement || "",
      },
      payment: {
        method: payment?.method || "cartao",
        status: payment?.status || "approved",
        pixCopiaColar: payment?.pixCopiaColar || null,
      },
      items: Array.isArray(items) ? items.map((it) => ({
        id: String(it.productId || it.id || "pizza"),
        name: it.name || it.nome || "Pizza",
        size: it.size || it.tamanho || "grande",
        quantity: Number(it.quantity || it.qtd || 1),
        price: Number(it.unitPrice || it.preco || 0),
        totalPrice: Number(it.lineTotal || (it.unitPrice || 0) * (it.quantity || 1)),
        border: it.border || null,
      })) : [],
    };

    // 2. Registra o pedido no endpoint serverless /api/create-order (disponibiliza para o Consumer POS)
    let apiResponseData = null;
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const json = await res.json();
        apiResponseData = json.data || json.order || json;
      }
    } catch (apiErr) {
      console.warn("[enviarParaDesktop] Erro ao chamar /api/create-order:", apiErr.message);
    }

    // 3. Tenta inserir na tabela orders do Supabase
    try {
      await supabase.from("orders").insert(orderPayload);
    } catch (supaErr) {
      console.warn("[enviarParaDesktop] Erro Supabase orders insert:", supaErr.message);
    }

    const finalResponseData = apiResponseData || orderPayload;

    return {
      ok: true,
      status: 200,
      data: finalResponseData,
      json: async () => finalResponseData,
      text: async () => JSON.stringify(finalResponseData),
    };

  } catch (error) {
    console.error("[enviarParaDesktop Error]", error);
    return toErrorResponse(error);
  }
};

/* =========== SUPABASE: CONSULTAR CLIENTE POR TELEFONE =========== */
const checkCustomerByPhone = async (phone) => {
  try {
    const cleaned = String(phone || "").replace(/\D/g, "");
    if (!cleaned) return toErrorResponse("Telefone inválido");

    const { data, error } = await supabase
      .from("customers")
      .select("*, orders(*, order_items(*))")
      .eq("phone", cleaned)
      .maybeSingle();

    if (error || !data) {
      const response = await serverInstance.baseDomain.instance.get(
        `/api/customers/by-phone?phone=${cleaned}`
      );
      return toResponse(response);
    }

    return {
      ok: true,
      status: 200,
      data,
      json: async () => data,
      text: async () => JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

/* =========== SUPABASE: CADASTRAR / ATUALIZAR CLIENTE =========== */
const salvarCliente = async (params) => {
  try {
    const payload = normalizePayload(params);
    const cleanedPhone = String(payload.phone || "").replace(/\D/g, "");

    if (!cleanedPhone) return toErrorResponse("Telefone obrigatório");

    const upsertData = {
      phone: cleanedPhone,
      name: payload.name || "Cliente Anne & Tom",
      email: payload.email || null,
      pin: payload.pin || "123456",
      points: payload.points ?? 50,
      is_subscriber: !!payload.isSubscriber,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("customers")
      .upsert(upsertData, { onConflict: "phone" })
      .select()
      .single();

    if (error) {
      console.error("[Supabase SalvarCliente Error]", error);
    }

    // Dispara backup remoto em segundo plano
    serverInstance.baseDomain.instance.post(`/api/customers`, payload).catch(() => null);

    const resData = data || payload;

    return {
      ok: true,
      status: 200,
      data: resData,
      json: async () => resData,
      text: async () => JSON.stringify(resData),
    };
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

const fetchMenu = async () => {
  try {
    const response = await serverInstance.baseDomain.instance.get(`/api/menu`);
    return toResponse(response);
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

/* =========== SUPABASE: BUSCAR LISTA DE PEDIDOS =========== */
const fetchOrders = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), customers(*)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      const response = await serverInstance.baseDomain.instance.get(`/api/orders`);
      return toResponse(response);
    }

    return {
      ok: true,
      status: 200,
      data,
      json: async () => data,
      text: async () => JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

const fetchBusinessHours = async () => {
  try {
    const response = await serverInstance.baseDomain.instance.get(
      `/api/pdv/business-hours`
    );
    return toResponse(response);
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

const confirmDelivery = async (orderId) => {
  try {
    await supabase
      .from("orders")
      .update({ status: "done", updated_at: new Date().toISOString() })
      .or(`id.eq.${orderId},display_code.eq.${orderId}`);

    const response = await serverInstance.baseDomain.instance.post(
      `/api/orders/${encodeURIComponent(orderId)}/status`,
      { status: "finalizado" }
    ).catch(() => null);

    return {
      ok: true,
      status: 200,
      data: { success: true },
      json: async () => ({ success: true }),
      text: async () => JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return toErrorResponse(error);
  }
};

// Proxies Mercado Pago same-origin
const createPixPayment = async (params = {}, idempotencyKey) => {
  const payload = normalizePayload(params);
  return callSameOriginProxy("/api/create-pix", payload, idempotencyKey);
};

const createCardPayment = async (params = {}, idempotencyKey) => {
  const payload = normalizePayload(params);
  return callSameOriginProxy("/api/create-card", payload, idempotencyKey);
};

const createSubscription = async (params = {}) => {
  const payload = normalizePayload(params);
  return callSameOriginProxy("/api/create-subscription", payload);
};

const server = {
  fetchStatus,
  enviarParaDesktop,
  checkCustomerByPhone,
  salvarCliente,
  fetchMenu,
  fetchOrders,
  fetchBusinessHours,
  confirmDelivery,
  createPixPayment,
  createCardPayment,
  createSubscription,
};

export default server;
