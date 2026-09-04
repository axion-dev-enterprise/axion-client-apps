// src/pages/CustomerDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteLayout from "../components/layout/SiteLayout";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrencyBRL } from "../utils/menu";

export const CustomerDashboardPage = () => {
  const { customer, isAuthenticated, checkPhoneRegistered, loginOrRegister, logout, loadingAuth } = useAuth();
  const { addItem } = useCart();
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isExistingPhone, setIsExistingPhone] = useState(false);
  const [activeTab, setActiveTab] = useState("historico");
  const [repeatSuccess, setRepeatSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (phoneInput) {
      const isReg = checkPhoneRegistered(phoneInput);
      setIsExistingPhone(isReg);
    } else {
      setIsExistingPhone(false);
    }
  }, [phoneInput, checkPhoneRegistered]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    const res = await loginOrRegister({ name: nameInput, phone: phoneInput, pin: pinInput });
    if (!res.ok) {
      setAuthError(res.error || "Falha na autenticação via auth.annetom.com.");
    }
  };

  const formatDisplayOrderId = (rawId) => {
    if (!rawId) return "#0000";
    const str = String(rawId);
    if (str.includes("-")) {
      const parts = str.split("-");
      const last = parts[parts.length - 1];
      if (last.length >= 3) return `#${last}`;
    }
    return str.startsWith("#") ? str : `#${str}`;
  };

  const ordersList = React.useMemo(() => {
    const raw = customer?.orders || [];
    const map = new Map();
    raw.forEach((o) => {
      if (o && o.id && Number(o.total) > 0) {
        const key = String(o.id);
        const existing = map.get(key);
        if (!existing || (Number(o.total) > 0 && Number(existing.total) === 0)) {
          map.set(key, o);
        }
      }
    });
    return Array.from(map.values());
  }, [customer?.orders]);

  const totalPoints = customer?.points || ordersList.reduce((acc, o) => acc + (o.pointsEarned ?? Math.floor(Number(o.total) || 0)), 0);
  const nextRewardThreshold = 100;
  const rewardProgress = Math.min(100, Math.round((totalPoints / nextRewardThreshold) * 100));

  const handleRepeatOrder = (order) => {
    if (Array.isArray(order.items)) {
      order.items.forEach((it) => {
        const itemName = typeof it === "string" ? it : (it.name || it.nome || "Pizza");
        const itemPrice = typeof it === "string" ? 45 : (it.price || it.precoUnitario || 0);
        const itemQty = typeof it === "string" ? 1 : (it.qty || it.quantidade || 1);

        addItem({
          id: itemName.toLowerCase().replace(/\s+/g, "-"),
          nome: itemName,
          name: itemName,
          preco_grande: itemPrice,
          price: itemPrice,
          quantidade: itemQty,
        });
      });
    }
    setRepeatSuccess(`Pedido ${formatDisplayOrderId(order.id)} re-adicionado ao seu carrinho! Redirecionando...`);
    setTimeout(() => {
      navigate("/checkout");
    }, 1200);
  };

  if (!isAuthenticated) {
    return (
      <SiteLayout
        title="Perfil do Cliente (annetom.com/me)"
        subtitle="Acesse sua conta para ver histórico de pedidos, fidelidade e benefícios do Clube da Pizza."
      >
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-3xl flex items-center justify-center mx-auto">
              🔐
            </div>
            <h2 className="text-2xl font-black text-slate-900">Entrar em annetom.com/me</h2>
            <p className="text-xs text-slate-600 font-medium">
              Digite seu WhatsApp e PIN de 6 dígitos para acessar sua conta com segurança.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 leading-snug">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telefone (WhatsApp)</label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {isExistingPhone && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
                <span>🔒</span>
                <span>Conta Encontrada! Digite seu PIN de 6 dígitos abaixo:</span>
              </div>
            )}

            {(!isExistingPhone || !phoneInput) && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required={!isExistingPhone}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PIN de Acesso (6 números)</label>
              <input
                type="password"
                maxLength={6}
                placeholder="******"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-black text-slate-950 text-sm transition shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loadingAuth ? "Verificando..." : isExistingPhone ? "Entrar na Minha Conta →" : "Criar Conta & Acessar →"}
            </button>
          </form>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout
      title={`Olá, ${customer.name || "Cliente"}!`}
      subtitle="Gerencie seus pedidos, dados cadastrais e pontos do Programa de Fidelidade Anne & Tom."
    >
      <div className="space-y-8">
        {repeatSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-bold text-emerald-800 animate-pulse text-center">
            {repeatSuccess}
          </div>
        )}

        {/* Profile & Loyalty Header Card */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/60 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-md grid md:grid-cols-3 gap-6 items-center border-2 border-amber-300">
          <div className="md:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                VIP Anne &amp; Tom
              </span>
              {customer?.isSubscriber && (
                <span className="bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  ✨ ASSINANTE CLUBE DA PIZZA
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{customer.name || "Cliente Registrado"}</h2>
            <div className="flex flex-wrap gap-4 text-xs text-slate-700">
              <p>📱 WhatsApp: <strong className="text-slate-950">{customer.phone || "Não informado"}</strong></p>
              {customer.email && <p>✉️ E-mail: <strong className="text-slate-950">{customer.email}</strong></p>}
            </div>
          </div>

          <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 text-center space-y-2 shadow-sm">
            <span className="text-3xl">⭐</span>
            <p className="text-2xl font-black text-amber-600">{totalPoints} PONTOS</p>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${rewardProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-700 font-extrabold">
              {totalPoints >= nextRewardThreshold
                ? "🎉 Você tem pontos para 1 Broto Grátis!"
                : `Faltam ${nextRewardThreshold - totalPoints} pontos para 1 Broto Grátis`}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("historico")}
            className={`pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === "historico"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            📜 Meus Pedidos ({ordersList.length})
          </button>
          <button
            onClick={() => setActiveTab("enderecos")}
            className={`pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === "enderecos"
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            📍 Endereços Salvos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "historico" && (
          <div className="space-y-4">
            {ordersList.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
                <span className="text-4xl">🍕</span>
                <h3 className="font-black text-lg text-slate-900">Nenhum pedido realizado ainda</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Faça seu primeiro pedido e acumule pontos para trocar por pizzas grátis!
                </p>
                <Link
                  to="/cardapio"
                  className="inline-block px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition"
                >
                  Ver Cardápio
                </Link>
              </div>
            ) : (
              ordersList.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{formatDisplayOrderId(ord.id)}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        {ord.status || "Concluído"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{ord.date}</p>
                    <p className="text-xs font-semibold text-slate-700">
                      Total: <strong>{formatCurrencyBRL(ord.total)}</strong> ({ord.pointsEarned} pontos)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRepeatOrder(ord)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    🔄 Repetir Pedido
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "enderecos" && (
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3">
            <h3 className="font-black text-sm text-slate-900">Endereço Principal</h3>
            <p className="text-xs text-slate-600 font-medium">
              {customer.addresses?.[0] || customer.address || "Zona Norte, São Paulo - SP (Salvo no último pedido)"}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex justify-between">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-xs transition"
          >
            🚪 Sair da Conta
          </button>
        </div>
      </div>
    </SiteLayout>
  );
};

export default CustomerDashboardPage;
