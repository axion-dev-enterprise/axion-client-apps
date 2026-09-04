import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../lib/supabase";
import { formatCurrencyBRL } from "../utils/menu";

const STATUS_OPTIONS = [
  { key: "open", label: "Recebido", bg: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "preparing", label: "Em Preparo", bg: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "out_for_delivery", label: "Saiu p/ Entrega", bg: "bg-purple-100 text-purple-800 border-purple-300" },
  { key: "done", label: "Entregue", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Busca inicial dos pedidos no Supabase
  const fetchKitchenOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: supaErr } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (supaErr) throw supaErr;
      setOrders(data || []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("[KDS] Erro ao buscar pedidos:", err);
      setError("Não foi possível carregar os pedidos da cozinha.");
    } finally {
      setLoading(false);
    }
  }, []);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const playOrderChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore autoplay restriction
    }
  }, [soundEnabled]);

  // Escuta atualizações em tempo real via Supabase Realtime
  useEffect(() => {
    fetchKitchenOrders();

    const channel = supabase
      .channel("kitchen-kds-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => {
          playOrderChime();
          fetchKitchenOrders();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        () => {
          fetchKitchenOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchKitchenOrders, playOrderChime]);

  // Atualização manual de status de pedido na cozinha
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { error: err } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (err) throw err;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("[KDS] Erro ao atualizar status:", err);
      alert("Falha ao atualizar o status do pedido.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER KDS */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logopizzaria.png" alt="Anne & Tom" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-amber-400">KDS — Painel da Cozinha</h1>
              <p className="text-xs text-slate-400">Pizzaria Anne &amp; Tom • Operação Realtime</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-700/60 px-3 py-1.5 rounded-full text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Realtime Conectado • Atualizado às {lastUpdate.toLocaleTimeString()}
          </div>

          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playOrderChime();
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition border ${
              soundEnabled
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-700 text-slate-400 border-slate-600"
            }`}
          >
            {soundEnabled ? "🔊 Som On" : "🔇 Som Off"}
          </button>

          <button
            onClick={fetchKitchenOrders}
            className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-white font-medium transition"
          >
            🔄 Atualizar
          </button>
        </div>
      </header>

      {/* CONTEÚDO / LISTA DE PEDIDOS */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <p>Carregando pedidos da cozinha...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <p className="text-2xl">🍕 Sem pedidos pendentes na fila!</p>
            <p className="text-sm">Novos pedidos aparecerão automaticamente nesta tela em tempo real.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((ord) => {
              const currentStatus = String(ord.status || "open").toLowerCase();
              let items = [];
              if (Array.isArray(ord.order_items) && ord.order_items.length > 0) {
                items = ord.order_items;
              } else if (Array.isArray(ord.items)) {
                items = ord.items;
              } else if (typeof ord.items === "string") {
                try { items = JSON.parse(ord.items); } catch (e) { items = []; }
              }

              return (
                <div
                  key={ord.id}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Cabeçalho do Card */}
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                      <div>
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          #{ord.display_code || String(ord.id).slice(0, 8)}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {ord.customer_name || "Cliente Anne & Tom"}
                        </h3>
                        <p className="text-xs text-slate-400">{ord.customer_phone || ""}</p>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          STATUS_OPTIONS.find((s) => s.key === currentStatus)?.bg ||
                          "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {STATUS_OPTIONS.find((s) => s.key === currentStatus)?.label || currentStatus}
                      </span>
                    </div>

                    {/* Itens do Pedido */}
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/40 text-xs flex justify-between items-start gap-2"
                        >
                          <div>
                            <span className="font-bold text-amber-300 mr-1">
                              {item.quantity || 1}x
                            </span>
                            <span className="font-medium text-slate-200">{item.name}</span>
                            {item.notes && (
                              <p className="text-[11px] text-amber-400/90 italic mt-0.5">
                                Obs: {item.notes}
                              </p>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono">
                            {formatCurrencyBRL((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Resumo Financeiro */}
                    <div className="pt-2 border-t border-slate-700/40 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total do Pedido:</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {formatCurrencyBRL(ord.total_final || ord.total || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Ações de Troca de Status */}
                  <div className="mt-5 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "preparing")}
                      className={`text-xs py-2 px-3 rounded-lg font-semibold transition ${
                        currentStatus === "preparing"
                          ? "bg-amber-500 text-slate-950 font-bold shadow"
                          : "bg-slate-700 hover:bg-slate-600 text-amber-300"
                      }`}
                    >
                      🔥 Em Preparo
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(ord.id, "out_for_delivery")}
                      className={`text-xs py-2 px-3 rounded-lg font-semibold transition ${
                        currentStatus === "out_for_delivery"
                          ? "bg-purple-600 text-white font-bold shadow"
                          : "bg-slate-700 hover:bg-slate-600 text-purple-300"
                      }`}
                    >
                      🛵 Saiu p/ Entrega
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(ord.id, "done")}
                      className={`col-span-2 text-xs py-2 px-3 rounded-lg font-semibold transition mt-1 ${
                        currentStatus === "done"
                          ? "bg-emerald-600 text-white font-bold shadow"
                          : "bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      ✅ Concluir / Entregue
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
