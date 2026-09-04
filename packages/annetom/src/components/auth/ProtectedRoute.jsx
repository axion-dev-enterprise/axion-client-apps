import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole = "customer" }) {
  const navigate = useNavigate();
  const { customer, staffAuth, loginStaff } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Proteção de Rota do Cliente
  if (requiredRole === "customer") {
    if (!customer) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
            <img src="/logopizzaria.png" alt="Anne & Tom" className="w-16 h-16 object-contain mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Acesso Restrito ao Cliente</h2>
              <p className="text-xs text-slate-400">
                Por favor, faça login com seu WhatsApp para acessar sua conta, historico e pontos VIP.
              </p>
            </div>
            <button
              onClick={() => navigate("/me")}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-amber-500/20"
            >
              Fazer Login com WhatsApp →
            </button>
            <Link to="/" className="block text-xs text-slate-500 hover:text-slate-300">
              ← Voltar para o Cardápio Principal
            </Link>
          </div>
        </div>
      );
    }
    return children;
  }

  // 2. Proteção de Rota Operacional / Staff (Kitchen, Admin, Motoboy)
  const isStaffAuthenticated =
    staffAuth &&
    (staffAuth.role === "admin" || staffAuth.role === requiredRole);

  if (isStaffAuthenticated) {
    return children;
  }

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setError("Por favor, digite seu PIN de 4 dígitos.");
      return;
    }

    setLoading(true);
    setError("");

    const res = loginStaff({ pin, role: requiredRole });
    setLoading(false);

    if (!res.ok) {
      setError(res.error || "PIN incorreto.");
      setPin("");
    }
  };

  const getRoleTitle = () => {
    switch (requiredRole) {
      case "admin":
        return "Painel Administrativo DRE";
      case "kitchen":
        return "KDS Cozinha em Tempo Real";
      case "motoboy":
        return "WebApp do Entregador";
      default:
        return "Área Restrita da Operação";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          🔒
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">{getRoleTitle()}</h2>
          <p className="text-xs text-slate-400">Digite seu PIN de 4 dígitos para autorizar o acesso.</p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="• • • •"
            autoFocus
            className="w-full text-center text-2xl tracking-[0.5em] font-bold bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-2xl py-3 text-white outline-none"
          />

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-amber-500/20"
          >
            {loading ? "Verificando..." : "Desbloquear Acesso →"}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
          <span>PIN Master: 7777</span>
          <Link to="/" className="hover:text-slate-300">
            Ir para a Loja
          </Link>
        </div>
      </div>
    </div>
  );
}
