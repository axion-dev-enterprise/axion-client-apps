import React, { useState, useEffect } from "react";

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Exibe apenas se não tiver sido dispensado na sessão
      const dismissed = sessionStorage.getItem("pwa_install_dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Usuário respondeu ao prompt de instalação: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa_install_dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 flex flex-col gap-3 animate-slide-up backdrop-blur-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <img
            src="/logopizzaria.png"
            alt="Anne & Tom"
            className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1"
          />
          <div>
            <h4 className="font-black text-sm text-white">Instalar App Anne & Tom</h4>
            <p className="text-xs text-slate-300">
              Peça mais rápido direto da sua tela inicial sem comissão!
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white text-xs p-1"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow transition-all text-center"
        >
          📲 Instalar Agora (Grátis)
        </button>
        <button
          onClick={handleDismiss}
          className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all"
        >
          Agora não
        </button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
