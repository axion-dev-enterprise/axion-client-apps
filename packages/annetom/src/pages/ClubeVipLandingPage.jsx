import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import server from "../api/server";

export default function ClubeVipLandingPage() {
  const navigate = useNavigate();
  const authCtx = useAuth();
  const customer = authCtx?.customer;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!customer) {
      alert("Por favor, faça seu cadastro/login para assinar o Clube VIP!");
      navigate("/me");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await server.createSubscription({
        amount: 69.90,
        description: "Assinatura Clube da Pizza Anne & Tom (R$ 69,90/mês)",
        payerEmail: customer.email || `${customer.phone}@annetom.com.br`,
        payerName: customer.name,
      });

      if (!res.ok) {
        throw new Error("Não foi possível gerar a assinatura no momento.");
      }

      const data = await res.json();
      const checkoutUrl = data.checkoutUrl || data.init_point;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("URL do checkout não retornada pelo servidor.");
      }
    } catch (err) {
      console.error("[ClubeVIP] Erro na assinatura:", err);
      setError(err.message || "Erro ao conectar com a operadora de pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logopizzaria.png" alt="Anne & Tom" className="w-10 h-10 object-contain" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-amber-400">Clube VIP Anne &amp; Tom</p>
              <p className="text-[11px] text-slate-400">vip.annetom.com</p>
            </div>
          </Link>

          <button
            onClick={() => navigate("/cardapio")}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-full transition"
          >
            Ver Cardápio →
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ⭐ Assinatura Exclusiva de Amantes de Pizza
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Economize mais de <span className="text-amber-400">R$ 1.200 por ano</span> em pizzas gourmet.
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Seja membro do Clube da Pizza Anne &amp; Tom por apenas{" "}
            <strong className="text-emerald-400">R$ 69,90/mês</strong> e receba brindes, bordas vulcão e descontos exclusivos em TODOS os seus pedidos!
          </p>

          <div className="pt-4">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
            >
              {loading ? "Processando..." : "Quero assinar por R$ 69,90/mês →"}
            </button>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>
        </div>

        {/* BENEFÍCIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="text-3xl">🍫</div>
            <h3 className="font-bold text-white text-base">Big Esfiha Prestígio Grátis</h3>
            <p className="text-xs text-slate-400">
              Toda semana um doce gourmet de R$ 18,90 de presente direto no seu pedido.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="text-3xl">🧀</div>
            <h3 className="font-bold text-white text-base">Borda de Requeijão Grátis</h3>
            <p className="text-xs text-slate-400">
              Upgrade automático de borda Requeijão ou Catupiry em todas as suas pizzas grandes.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="text-3xl">🎂</div>
            <h3 className="font-bold text-white text-base">Presente no Seu Aniversário</h3>
            <p className="text-xs text-slate-400">
              Uma pizza doce broto inteiramente grátis para comemorar seu dia especial.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
