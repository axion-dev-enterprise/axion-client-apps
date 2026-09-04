import React, { useState } from "react";
import server from "../../api/server";
import { trackSubscribe } from "../../utils/metaPixel";
import { useAuth } from "../../context/AuthContext";
import QuickAuthModal from "../auth/QuickAuthModal";

const PizzaClubSection = () => {
  const { customer, isAuthenticated, isSubscriber } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const startSubscriptionProcess = async (customerData) => {
    const activeCustomer = customerData || customer;
    setLoading(true);
    setError("");
    try {
      trackSubscribe({ planName: "Clube da Pizza", value: 69.90 });

      // Cria preferência de pagamento no Mercado Pago sem ativar antecipadamente
      const res = await server.createSubscription({
        payerEmail: activeCustomer?.email || `${activeCustomer?.phone || "cliente"}@annetom.com.br`,
        payerName: activeCustomer?.name || "Assinante Clube Anne & Tom",
      });
      const data = await res.json().catch(() => null);
      const checkoutUrl = data?.checkoutUrl || data?.init_point;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Não foi possível gerar a página segura de checkout.");
      }
    } catch (err) {
      console.error("[PizzaClubSection] erro ao assinar:", err);
      setError("Erro ao gerar link do Mercado Pago. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      startSubscriptionProcess();
    }
  };

  const handleAuthSuccess = (loggedCustomer) => {
    setShowAuthModal(false);
    startSubscriptionProcess(loggedCustomer);
  };

  return (
    <section className="my-8 px-4 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider mb-3 backdrop-blur-sm">
            <span>✨ CLUBE DA PIZZA ANNE & TOM</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {isSubscriber ? "Você é Assinante VIP!" : "Assine por apenas R$ 69,90/mês"}
              </h2>
              <p className="text-amber-100 text-sm mt-1 max-w-xl font-medium">
                {isSubscriber
                  ? `Seus benefícios mensais do Clube da Pizza estão ativos na sua conta (${customer?.name || "VIP"}).`
                  : "Economize todo mês e garanta benefícios exclusivos direto no seu delivery."}
              </p>

              {/* Grid de benefícios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <span className="text-xl">🍫</span>
                  <span className="text-xs font-bold">1 Big Esfirra Prestígio grátis/mês</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <span className="text-xl">🧀</span>
                  <span className="text-xs font-bold">1 Borda de requeijão grátis/mês</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <span className="text-xl">🚚</span>
                  <span className="text-xs font-bold">1 Frete grátis por mês (consultar raio)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <span className="text-xl">⭐</span>
                  <span className="text-xs font-bold">Descontos e acúmulo acelerado</span>
                </div>
              </div>
            </div>

            {/* Ação Principal */}
            <div className="shrink-0 flex flex-col items-center md:items-end justify-center pt-2 md:pt-0">
              <button
                type="button"
                disabled={loading || isSubscriber}
                onClick={handleSubscribeClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 disabled:opacity-75 text-white font-black text-sm sm:text-base shadow-2xl transition transform active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Redirecionando ao Mercado Pago...</span>
                  </>
                ) : isSubscriber ? (
                  "✨ Assinatura VIP Ativa no Perfil"
                ) : (
                  "Quero assinar por R$ 69,90/mês →"
                )}
              </button>
              {error && (
                <p className="text-xs text-amber-200 mt-2 font-bold bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
                  {error}
                </p>
              )}
              <span className="text-[11px] text-amber-200 mt-2 font-medium">
                Cobrança recorrente via Mercado Pago • Cancele quando quiser
              </span>
            </div>
          </div>
        </div>
      </div>

      <QuickAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
};

export default PizzaClubSection;
