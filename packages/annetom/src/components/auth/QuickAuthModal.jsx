// src/components/auth/QuickAuthModal.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export const QuickAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginOrRegister, checkPhoneRegistered, loadingAuth } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isExistingPhone, setIsExistingPhone] = useState(false);

  useEffect(() => {
    if (phone) {
      const isReg = checkPhoneRegistered(phone);
      setIsExistingPhone(isReg);
    } else {
      setIsExistingPhone(false);
    }
  }, [phone, checkPhoneRegistered]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const res = await loginOrRegister({ name, phone, pin });
    if (res.ok) {
      setSuccessMsg(`Bem-vindo(a), ${res.customer.name}! Redirecionando...`);
      setTimeout(() => {
        onSuccess?.(res.customer);
        onClose?.();
      }, 800);
    } else {
      setError(res.error || "Erro ao conectar. Verifique seus dados.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm transition"
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-2xl flex items-center justify-center mx-auto">
            🔐
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {isExistingPhone ? "Entrar na Conta" : "Login / Cadastro"}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            {isExistingPhone
              ? "WhatsApp encontrado! Digite seu PIN de 6 dígitos para acessar."
              : "Acesse sua conta Anne & Tom com seu WhatsApp e PIN de 6 dígitos."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 leading-snug">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 animate-pulse">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Telefone WhatsApp *</label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {isExistingPhone && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
              <span>🔒</span>
              <span>Conta Cadastrada. Digite seu PIN para entrar:</span>
            </div>
          )}

          {(!isExistingPhone || !phone) && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome Completo *</label>
              <input
                type="text"
                placeholder="Ex: Carlos Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isExistingPhone}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">PIN de Acesso (6 dígitos) *</label>
            <input
              type="password"
              maxLength={6}
              placeholder="******"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loadingAuth}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-black text-slate-950 text-sm transition shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loadingAuth ? "Verificando..." : isExistingPhone ? "Entrar na Minha Conta →" : "Criar Conta & Entrar →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickAuthModal;
