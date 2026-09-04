import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import server from "../api/server";
import supabase from "../lib/supabase";

const STORAGE_KEY = "at_customer";
const ACCOUNTS_DB_KEY = "at_registered_accounts_v2";
const STAFF_AUTH_KEY = "at_staff_auth";

const AuthContext = createContext(null);

const getRegisteredAccounts = () => {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveRegisteredAccount = (account) => {
  try {
    if (!account || !account.phone) return;
    const db = getRegisteredAccounts();
    db[account.phone] = account;
    window.localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
};

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.orders)) {
        const uniqueMap = new Map();
        parsed.orders.forEach((ord) => {
          if (ord && ord.id && Number(ord.total) > 0) {
            const key = String(ord.id);
            uniqueMap.set(key, {
              ...ord,
              total: Number(ord.total) || 0,
              pointsEarned: ord.pointsEarned ?? Math.floor(Number(ord.total) || 0),
            });
          }
        });
        parsed.orders = Array.from(uniqueMap.values());
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [staffAuth, setStaffAuth] = useState(() => {
    try {
      const raw = window.sessionStorage.getItem(STAFF_AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (customer) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
        saveRegisteredAccount(customer);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [customer]);

  useEffect(() => {
    try {
      if (staffAuth) {
        window.sessionStorage.setItem(STAFF_AUTH_KEY, JSON.stringify(staffAuth));
      } else {
        window.sessionStorage.removeItem(STAFF_AUTH_KEY);
      }
    } catch {
      // ignore
    }
  }, [staffAuth]);

  // Autenticação de Operadores / Staff (PIN Cozinha, Admin, Motoboy)
  const loginStaff = useCallback(({ pin, role }) => {
    const cleanedPin = String(pin || "").trim();
    const attemptsKey = `staff_pin_attempts_${role}`;
    const attemptsRaw = window.sessionStorage.getItem(attemptsKey);
    const attemptsData = attemptsRaw ? JSON.parse(attemptsRaw) : { count: 0, lockUntil: 0 };
    const now = Date.now();

    if (attemptsData.lockUntil && now < attemptsData.lockUntil) {
      const minutesLeft = Math.ceil((attemptsData.lockUntil - now) / 60000);
      return {
        ok: false,
        error: `🔒 Acesso temporariamente bloqueado por segurança. Tente em ${minutesLeft} minuto(s).`,
      };
    }

    const MASTER_PIN = "7777";
    const KITCHEN_PIN = "5555";
    const MOTOBOY_PIN = "8888";

    let isValid = false;
    if (cleanedPin === MASTER_PIN) {
      isValid = true; // Admin PIN dá acesso a tudo
    } else if (role === "kitchen" && (cleanedPin === KITCHEN_PIN || cleanedPin === MASTER_PIN)) {
      isValid = true;
    } else if (role === "motoboy" && (cleanedPin === MOTOBOY_PIN || cleanedPin === MASTER_PIN)) {
      isValid = true;
    } else if (role === "admin" && cleanedPin === MASTER_PIN) {
      isValid = true;
    }

    if (!isValid) {
      const newCount = (attemptsData.count || 0) + 1;
      const lock = newCount >= 5 ? now + 10 * 60 * 1000 : 0;
      window.sessionStorage.setItem(attemptsKey, JSON.stringify({ count: newCount, lockUntil: lock }));
      const remainingAttempts = 5 - newCount;
      return {
        ok: false,
        error: remainingAttempts > 0
          ? `🔒 PIN incorreto. Você tem mais ${remainingAttempts} tentativa(s).`
          : `🔒 Bloqueado por 10 minutos após 5 erros.`,
      };
    }

    window.sessionStorage.removeItem(attemptsKey);
    const authData = { role: cleanedPin === MASTER_PIN ? "admin" : role, authenticatedAt: new Date().toISOString() };
    setStaffAuth(authData);
    return { ok: true, staffAuth: authData };
  }, []);

  const logoutStaff = useCallback(() => {
    setStaffAuth(null);
  }, []);

  const checkPhoneRegistered = useCallback((phone) => {
    const cleaned = String(phone || "").replace(/\D/g, "").replace(/^0+/, "");
    if (!cleaned || cleaned.length < 10) return false;
    const db = getRegisteredAccounts();
    return !!db[cleaned];
  }, []);

  const loginOrRegister = useCallback(async ({ name, phone, pin }) => {
    const cleanedPhone = String(phone || "")
      .replace(/\D/g, "")
      .replace(/^0+/, "");
    if (!cleanedPhone || cleanedPhone.length < 10) {
      return { ok: false, error: "Informe um telefone WhatsApp válido com DDD." };
    }

    const cleanedPin = String(pin || "").trim();
    if (!cleanedPin || !/^\d{6}$/.test(cleanedPin)) {
      return { ok: false, error: "O PIN de acesso deve conter exatamente 6 números." };
    }

    setLoading(true);
    try {
      let existing = null;
      const { data: supaCust } = await supabase
        .from("customers")
        .select("*, orders(*)")
        .eq("phone", cleanedPhone)
        .maybeSingle();

      if (supaCust) {
        existing = {
          id: supaCust.id,
          name: supaCust.name,
          phone: supaCust.phone,
          email: supaCust.email,
          pin: supaCust.pin || "123456",
          points: supaCust.points ?? 50,
          isSubscriber: !!supaCust.is_subscriber,
          orders: Array.isArray(supaCust.orders)
            ? supaCust.orders.map((o) => ({
                id: o.display_code || o.id,
                date: new Date(o.created_at).toLocaleDateString("pt-BR"),
                total: Number(o.total_final) || 0,
                status: o.status || "Concluído",
                items: Array.isArray(o.order_items) ? o.order_items.map((i) => i.name) : [],
              }))
            : [],
        };
      } else {
        const db = getRegisteredAccounts();
        existing = db[cleanedPhone];
      }

      if (existing) {
        const attemptsKey = `pin_attempts_${cleanedPhone}`;
        const attemptsRaw = window.sessionStorage.getItem(attemptsKey);
        const attemptsData = attemptsRaw ? JSON.parse(attemptsRaw) : { count: 0, lockUntil: 0 };
        const now = Date.now();

        if (attemptsData.lockUntil && now < attemptsData.lockUntil) {
          const minutesLeft = Math.ceil((attemptsData.lockUntil - now) / 60000);
          return {
            ok: false,
            error: `🔒 Conta temporariamente bloqueada por muitas tentativas. Tente novamente em ${minutesLeft} minuto(s).`,
          };
        }

        if (existing.pin && existing.pin !== cleanedPin) {
          const newCount = (attemptsData.count || 0) + 1;
          const lock = newCount >= 5 ? now + 10 * 60 * 1000 : 0;
          window.sessionStorage.setItem(attemptsKey, JSON.stringify({ count: newCount, lockUntil: lock }));
          const remainingAttempts = 5 - newCount;
          return {
            ok: false,
            error: remainingAttempts > 0
              ? `🔒 PIN incorreto para este WhatsApp. Você tem mais ${remainingAttempts} tentativa(s).`
              : `🔒 Limite de tentativas excedido. Bloqueado por 10 minutos.`,
          };
        }

        window.sessionStorage.removeItem(attemptsKey);

        const authenticatedCustomer = {
          ...existing,
          pin: cleanedPin,
          name: existing.name || name?.trim() || "Cliente Anne & Tom",
          isSubscriber: !!existing.isSubscriber,
          points: existing.points ?? 100,
          orders: existing.orders || [],
          addresses: existing.addresses || [],
        };

        await server.salvarCliente({
          phone: cleanedPhone,
          name: authenticatedCustomer.name,
          pin: cleanedPin,
          points: authenticatedCustomer.points,
          isSubscriber: authenticatedCustomer.isSubscriber,
        }).catch(() => null);

        setCustomer(authenticatedCustomer);
        saveRegisteredAccount(authenticatedCustomer);
        return { ok: true, customer: authenticatedCustomer, isNew: false };
      }

      if (!name || name.trim().length < 2) {
        return {
          ok: false,
          isNewAccountPrompt: true,
          error: "Telefone não cadastrado. Por favor, informe seu nome para criar uma nova conta.",
        };
      }

      const newCustomer = {
        name: name.trim(),
        phone: cleanedPhone,
        pin: cleanedPin,
        points: 50,
        isSubscriber: false,
        orders: [],
        addresses: [],
        created_at: new Date().toISOString(),
      };

      await server.salvarCliente(newCustomer).catch(() => null);
      setCustomer(newCustomer);
      saveRegisteredAccount(newCustomer);
      return { ok: true, customer: newCustomer, isNew: true };
    } catch (error) {
      console.error("[Auth] Erro ao autenticar:", error);
      return { ok: false, error: "Falha na comunicação com o servidor de autenticação." };
    } finally {
      setLoading(false);
    }
  }, []);

  const activateSubscription = useCallback(({ paymentStatus = "approved", subscriptionId } = {}) => {
    if (paymentStatus !== "approved" && paymentStatus !== "active") {
      console.warn("[AuthContext] Tentativa de ativar assinatura sem pagamento aprovado negada.");
      return false;
    }

    setCustomer((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        isSubscriber: true,
        subscriptionId: subscriptionId || `sub_${Date.now()}`,
        subscriptionDate: new Date().toISOString(),
        subscriptionStatus: "active",
      };
      saveRegisteredAccount(updated);

      if (updated.phone) {
        server.salvarCliente({
          phone: updated.phone,
          name: updated.name,
          pin: updated.pin,
          isSubscriber: true,
          points: updated.points,
        }).catch(() => null);
      }

      return updated;
    });
    return true;
  }, []);

  const recordOrder = useCallback((orderData) => {
    if (!orderData) return;

    const orderId = String(orderData.id || `ord-${Date.now()}`);
    const totalAmount = Number(orderData.totalFinal || orderData.total || orderData.total_final) || 0;
    const pointsEarned = orderData.pointsEarned ?? Math.floor(totalAmount);

    setCustomer((prevCustomer) => {
      if (!prevCustomer) return prevCustomer;

      const existingOrders = Array.isArray(prevCustomer.orders) ? prevCustomer.orders : [];

      if (existingOrders.some((o) => String(o.id) === orderId)) {
        return prevCustomer;
      }

      const newOrder = {
        id: orderId,
        date: orderData.date || (new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })),
        items: orderData.items || [],
        total: totalAmount,
        pointsEarned,
        status: orderData.status || "Recebido",
      };

      const updatedOrders = [newOrder, ...existingOrders];
      const updatedPoints = (prevCustomer.points || 0) + pointsEarned;

      const updatedCustomer = {
        ...prevCustomer,
        orders: updatedOrders,
        points: updatedPoints,
      };

      saveRegisteredAccount(updatedCustomer);

      if (updatedCustomer.phone) {
        server.salvarCliente({
          phone: updatedCustomer.phone,
          name: updatedCustomer.name,
          pin: updatedCustomer.pin,
          points: updatedPoints,
          isSubscriber: updatedCustomer.isSubscriber,
        }).catch(() => null);
      }

      return updatedCustomer;
    });
  }, []);

  const clearOrders = useCallback(() => {
    setCustomer((prevCustomer) => {
      if (!prevCustomer) return prevCustomer;
      const updated = {
        ...prevCustomer,
        orders: [],
      };
      saveRegisteredAccount(updated);
      return updated;
    });
  }, []);

  const redeemPoints = useCallback((pointsToRedeem) => {
    let success = false;
    setCustomer((prev) => {
      if (!prev) return prev;
      const currentPoints = prev.points ?? 0;
      if (currentPoints < pointsToRedeem) return prev;
      success = true;
      const updated = {
        ...prev,
        points: currentPoints - pointsToRedeem,
      };
      saveRegisteredAccount(updated);

      if (updated.phone) {
        server.salvarCliente({
          phone: updated.phone,
          name: updated.name,
          pin: updated.pin,
          points: updated.points,
          isSubscriber: updated.isSubscriber,
        }).catch(() => null);
      }

      return updated;
    });
    return success;
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      staffAuth,
      loadingAuth: loading,
      checkPhoneRegistered,
      loginOrRegister,
      loginStaff,
      logoutStaff,
      activateSubscription,
      logout,
      redeemPoints,
      recordOrder,
      clearOrders,
      isAuthenticated: !!customer,
      isSubscriber: !!customer?.isSubscriber,
    }),
    [customer, staffAuth, loading, checkPhoneRegistered, loginOrRegister, loginStaff, logoutStaff, activateSubscription, logout, redeemPoints, recordOrder, clearOrders]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
};

export default AuthContext;
