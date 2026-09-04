import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const DRAFT_SODAS = [
  "Guaraná Antarctica 2L",
  "Coca-Cola Zero 2L",
  "Fanta Laranja 2L",
  "Soda Limonada 2L",
  "Guaraná Zero 2L",
];

const DynamicPromotionsBanner = ({ subtotal = 0, items = [], onSelectFreeDrink }) => {
  const { customer, isSubscriber } = useAuth();
  const { addItem } = useCart();
  const [selectedFreeDrink, setSelectedFreeDrink] = useState(DRAFT_SODAS[0]);
  const [addedGifts, setAddedGifts] = useState({ esfirra: false, borda: false });

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb

  // Conta quantidade de pizzas grandes no carrinho
  const pizzasGrandes = items.filter(
    (i) => i.tamanho === "grande" || i.tamanho === "G"
  ).reduce((acc, i) => acc + (i.quantidade || 1), 0);

  const isTercaQuarta = dayOfWeek === 2 || dayOfWeek === 3;
  const isQuinta = dayOfWeek === 4;
  const isSextaSabado = dayOfWeek === 5 || dayOfWeek === 6;
  const isDomingo = dayOfWeek === 0;

  // Conta refrigerante no carrinho
  const temRefrigerante = items.some(
    (i) => (i.nome || i.name || "").toLowerCase().includes("refrigerante") || (i.nome || i.name || "").toLowerCase().includes("coca") || (i.nome || i.name || "").toLowerCase().includes("guaran")
  );

  // Condições de brinde atingido conforme diretriz semanal Anne & Tom
  const brindeEsfirraTercaQuartaAtingido = isTercaQuarta && pizzasGrandes >= 1 && temRefrigerante;
  const brindeBordaQuintaAtingido = isQuinta && pizzasGrandes >= 1;
  const brindeRefriSextaSabadoAtingido = isSextaSabado && pizzasGrandes >= 2;
  const brindeDomingoAtingido = isDomingo && pizzasGrandes >= 1;

  const handleDrinkChange = (drink) => {
    setSelectedFreeDrink(drink);
    if (onSelectFreeDrink) {
      onSelectFreeDrink(drink);
    }
  };

  const handleAddSubscriberEsfirra = () => {
    addItem({
      id: "clube-esfirra-prestigio-0",
      nome: "🎁 Big Esfiha Prestígio (Brinde do Clube Anne & Tom)",
      tamanho: "broto",
      precoUnitario: 0,
      preco: 0,
      quantidade: 1,
      tipo: "brinde_clube",
    });
    setAddedGifts((prev) => ({ ...prev, esfirra: true }));
  };

  const handleAddSubscriberBorda = () => {
    addItem({
      id: "clube-borda-requeijao-0",
      nome: "🎁 Borda de Requeijão (Brinde do Clube Anne & Tom)",
      tamanho: "borda",
      precoUnitario: 0,
      preco: 0,
      quantidade: 1,
      tipo: "brinde_clube",
    });
    setAddedGifts((prev) => ({ ...prev, borda: true }));
  };

  return (
    <div className="space-y-3 my-3">
      {/* SEÇÃO VIP: Brindes de Assinante do Clube da Pizza */}
      {isSubscriber && (
        <div className="p-4 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 text-slate-900 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900">
              <span className="text-xl">🌟</span>
              <span>Benefícios do Clube da Pizza ({customer?.name || "VIP"}):</span>
            </div>
            <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow">
              ASSINANTE ATIVO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-amber-300/50">
            <button
              type="button"
              onClick={handleAddSubscriberEsfirra}
              disabled={addedGifts.esfirra}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                addedGifts.esfirra
                  ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                  : "bg-white border-amber-300 text-slate-900 hover:bg-amber-50 cursor-pointer shadow-xs"
              }`}
            >
              <span>🍫 1 Big Esfiha Prestígio (Grátis/mês)</span>
              <span className="font-black text-[11px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg">
                {addedGifts.esfirra ? "✓ Adicionado" : "+ Adicionar R$ 0,00"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleAddSubscriberBorda}
              disabled={addedGifts.borda}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                addedGifts.borda
                  ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                  : "bg-white border-amber-300 text-slate-900 hover:bg-amber-50 cursor-pointer shadow-xs"
              }`}
            >
              <span>🧀 1 Borda de Requeijão (Grátis/mês)</span>
              <span className="font-black text-[11px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg">
                {addedGifts.borda ? "✓ Adicionado" : "+ Adicionar R$ 0,00"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Banner de Terça e Quarta: Big Esfirra Prestígio Grátis */}
      {isTercaQuarta && (
        <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
          brindeEsfirraTercaQuartaAtingido
            ? "bg-amber-500/10 border-amber-500 text-slate-900"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900">
              <span className="text-xl">🍫</span>
              <span>Terça & Quarta Especial:</span>
            </div>
            <div className="text-xs font-bold text-amber-800 flex-1 sm:text-center">
              Ganhe 1 Big Esfiha Prestígio Grátis (compra de 1 Pizza Grande + 1 Refri)
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black text-center ${
              brindeEsfirraTercaQuartaAtingido
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-200 text-slate-700"
            }`}>
              {brindeEsfirraTercaQuartaAtingido ? "✨ BIG ESFIRRA ATIVADA!" : "Adicione 1 Pizza + 1 Refri"}
            </span>
          </div>
        </div>
      )}

      {/* Banner de Quinta: Borda de Requeijão Grátis */}
      {isQuinta && (
        <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
          brindeBordaQuintaAtingido
            ? "bg-emerald-500/10 border-emerald-500 text-slate-900"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900">
              <span className="text-xl">🧀</span>
              <span>Quinta da Borda Grátis:</span>
            </div>
            <div className="text-xs font-bold text-emerald-800 flex-1 sm:text-center">
              Ganhe Borda Recheada de Requeijão Grátis em qualquer Pizza Grande
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black text-center ${
              brindeBordaQuintaAtingido
                ? "bg-emerald-500 text-slate-950 shadow"
                : "bg-slate-200 text-slate-700"
            }`}>
              {brindeBordaQuintaAtingido ? "✨ BORDA GRÁTIS ATIVADA!" : "Adicione 1 Pizza Grande"}
            </span>
          </div>
        </div>
      )}

      {/* Banner de Sexta e Sábado: Refrigerante 2L Grátis */}
      {isSextaSabado && (
        <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
          brindeRefriSextaSabadoAtingido
            ? "bg-amber-500/10 border-amber-500 text-slate-900"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900">
              <span className="text-xl">🥤</span>
              <span>Sexta & Sábado em Família:</span>
            </div>
            <div className="text-xs font-bold text-amber-900 flex-1 sm:text-center">
              Ganhe 1 Refrigerante 2L Grátis na compra de 2 Pizzas Grandes
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black text-center ${
              brindeRefriSextaSabadoAtingido
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-200 text-slate-700"
            }`}>
              {brindeRefriSextaSabadoAtingido ? "✨ REFRIGERANTE 2L ATIVADO!" : "Adicione 2 Pizzas Grandes"}
            </span>
          </div>

          {brindeRefriSextaSabadoAtingido && (
            <div className="mt-3 pt-3 border-t border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-900">
                🎁 Escolha o sabor do seu Refrigerante 2L Grátis:
              </span>
              <select
                value={selectedFreeDrink}
                onChange={(e) => handleDrinkChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border-2 border-amber-500 bg-white text-slate-900 text-xs font-bold shadow-sm focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {DRAFT_SODAS.map((drink) => (
                  <option key={drink} value={drink}>
                    {drink} (Grátis)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Banner de Domingo: Escolha o Brinde */}
      {isDomingo && (
        <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${
          brindeDomingoAtingido
            ? "bg-purple-500/10 border-purple-500 text-slate-900"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-900">
              <span className="text-xl">⭐</span>
              <span>Domingo Especial:</span>
            </div>
            <div className="text-xs font-bold text-purple-900 flex-1 sm:text-center">
              Escolha: 1 Big Esfiha Prestígio OU Borda de Requeijão Grátis (1 Pizza Grande)
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black text-center ${
              brindeDomingoAtingido
                ? "bg-purple-600 text-white shadow"
                : "bg-slate-200 text-slate-700"
            }`}>
              {brindeDomingoAtingido ? "✨ BRINDE ESPECIAL ATIVADO!" : "Adicione 1 Pizza Grande"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicPromotionsBanner;
