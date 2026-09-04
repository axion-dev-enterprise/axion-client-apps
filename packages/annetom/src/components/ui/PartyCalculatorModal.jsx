import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const PartyCalculatorModal = ({ isOpen, onClose }) => {
  const [adults, setAdults] = useState(3);
  const [childrenCount, setChildrenCount] = useState(2);
  const [hungryLevel, setHungryLevel] = useState('normal'); // 'light', 'normal', 'hungry'
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  // Cálculo da quantidade estimada de fatias (Adulto: ~3-4 fatias, Criança: ~1.5-2 fatias)
  const multiplier = hungryLevel === 'light' ? 0.85 : hungryLevel === 'hungry' ? 1.25 : 1.0;
  const totalSlicesNeeded = Math.ceil((adults * 3.5 + childrenCount * 1.75) * multiplier);
  
  // Pizza grande: 8 fatias. Pizza broto: 4 fatias.
  const largePizzasNeeded = Math.floor(totalSlicesNeeded / 8);
  const remainderSlices = totalSlicesNeeded % 8;
  const brotoNeeded = remainderSlices > 0 ? 1 : 0;
  
  // Bebida: 1L a cada 3 pessoas
  const totalPeople = adults + childrenCount;
  const soda2LNeeded = Math.max(1, Math.ceil(totalPeople / 4));

  const handleAddSuggestion = () => {
    // Adiciona sugestão balanceada da casa
    addItem({
      id: 'calc-anne-tom-especial',
      nome: 'Pizza Especial Anne & Tom (Sugestão da Galera)',
      tamanho: 'grande',
      precoUnitario: 79.9,
      quantidade: Math.max(1, largePizzasNeeded),
      observacao: `Calculado para ${adults} adultos e ${childrenCount} crianças (${totalSlicesNeeded} fatias)`,
    });

    if (soda2LNeeded > 0) {
      addItem({
        id: 'calc-coca-2l',
        nome: 'Refrigerante 2L (Gelado)',
        tamanho: '2L',
        precoUnitario: 14.9,
        quantidade: soda2LNeeded,
      });
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <h2 className="text-xl font-extrabold text-slate-900">Calculadora de Galera</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Descubra a quantidade perfeita de pizzas e bebidas para o seu grupo sem desperdício.
        </p>

        <div className="space-y-4 mb-6">
          {/* Número de Adultos */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">🧑 Adultos</p>
              <p className="text-[11px] text-slate-500">Aproximadamente 3 a 4 fatias cada</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <span className="font-extrabold text-base w-5 text-center">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults((prev) => prev + 1)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Número de Crianças */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">👧 Crianças</p>
              <p className="text-[11px] text-slate-500">Aproximadamente 1.5 a 2 fatias cada</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <span className="font-extrabold text-base w-5 text-center">{childrenCount}</span>
              <button
                type="button"
                onClick={() => setChildrenCount((prev) => prev + 1)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Nível de Fome */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-1.5">Aceleração da Fome:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: '🥗 Leve' },
                { id: 'normal', label: '🍕 Normal' },
                { id: 'hungry', label: '🔥 Muita Fome' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setHungryLevel(lvl.id)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    hungryLevel === lvl.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resultado Recomendado */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-6 text-slate-900">
          <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wide mb-1">
            💡 Recomendação Anne &amp; Tom:
          </p>
          <div className="flex items-baseline justify-between">
            <p className="text-base font-extrabold text-slate-900">
              {largePizzasNeeded} Pizza{largePizzasNeeded > 1 ? 's' : ''} Grande{largePizzasNeeded > 1 ? 's' : ''} (8 fatias)
              {brotoNeeded > 0 ? ' + 1 Broto' : ''}
            </p>
            <span className="text-xs font-bold text-amber-700">{totalSlicesNeeded} fatias</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            + {soda2LNeeded} Refrigerante{soda2LNeeded > 1 ? 's' : ''} 2L bem gelados.
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleAddSuggestion}
          disabled={added}
          className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 px-4 rounded-full text-sm font-extrabold shadow-lg pulse-gold-glow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
        >
          {added ? (
            <span>✅ Adicionado ao Carrinho!</span>
          ) : (
            <span>🍕 Adicionar Sugestão Recomendada ao Carrinho</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PartyCalculatorModal;
