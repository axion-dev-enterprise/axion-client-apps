import React, { useState } from "react";

const PRIZES = [
  { text: "🍕 10% OFF", code: "PRIMEIRA10", discount: 10 },
  { text: "🥤 Refri Grátis", code: "REFRIGRATIS", discount: 5 },
  { text: "🍫 Esfiha Doce", code: "ESFIHAVIP", discount: 15 },
  { text: "🚀 Frete Grátis", code: "FRETEGRATIS", discount: 8.9 },
  { text: "⭐ 20% OFF VIP", code: "VIP20", discount: 20 },
  { text: "🧀 Borda Grátis", code: "BORDAFREE", discount: 10 },
];

export default function SpinWheelModal({ isOpen, onClose, onWinCoupon }) {
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning || wonPrize) return;
    setSpinning(true);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    const degreesPerPrize = 360 / PRIZES.length;
    const newRotation = 360 * 5 + (360 - prizeIndex * degreesPerPrize);

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prize);
      if (onWinCoupon) onWinCoupon(prize);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        <div className="space-y-1">
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            🎰 Roleta de Prêmios Anne &amp; Tom
          </span>
          <h2 className="text-xl font-bold text-white pt-1">Gire e Ganhe um Desconto!</h2>
          <p className="text-xs text-slate-400">
            {wonPrize ? "Parabéns! Seu cupom foi resgatado com sucesso." : "Gire a roleta para resgatar seu prêmio do 1º pedido."}
          </p>
        </div>

        {/* ROLETA CANVAS / VISUAL */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div
            className="w-full h-full rounded-full border-4 border-amber-500/60 overflow-hidden relative transition-transform duration-[4000ms] ease-out shadow-lg"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {PRIZES.map((p, idx) => (
              <div
                key={idx}
                className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-amber-300"
                style={{
                  transform: `rotate(${idx * (360 / PRIZES.length)}deg)`,
                }}
              >
                <span className="pt-2">{p.text}</span>
              </div>
            ))}
          </div>
          <div className="absolute -top-2 text-2xl text-amber-400">▼</div>
        </div>

        {wonPrize ? (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">Seu Cupom de Desconto:</p>
            <p className="text-lg font-mono font-bold text-emerald-400">{wonPrize.code}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(wonPrize.code);
                alert(`Cupom ${wonPrize.code} copiado! Aplique no checkout.`);
                onClose();
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
            >
              📋 Copiar Cupom &amp; Usar no Checkout
            </button>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-amber-500/20"
          >
            {spinning ? "Girando Roleta..." : "🎰 GIRAR ROLETA GRÁTIS"}
          </button>
        )}
      </div>
    </div>
  );
}
