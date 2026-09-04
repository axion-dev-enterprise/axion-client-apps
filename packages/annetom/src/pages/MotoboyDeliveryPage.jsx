import React, { useCallback, useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { formatCurrencyBRL } from "../utils/menu";

export default function MotoboyDeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["out_for_delivery", "preparing", "open"])
        .order("created_at", { ascending: false });

      setDeliveries(data || []);
    } catch (err) {
      console.error("[Motoboy] Erro ao buscar entregas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();

    const channel = supabase
      .channel("motoboy-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchDeliveries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDeliveries]);

  const handleMarkDelivered = async (orderId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "done", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;
      setDeliveries((prev) => prev.filter((d) => d.id !== orderId));
    } catch (err) {
      alert("Erro ao finalizar entrega.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER MOTOBOY */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logopizzaria.png" alt="Anne & Tom" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-sm font-bold text-amber-400">Entregas Anne &amp; Tom</h1>
            <p className="text-[10px] text-slate-400">motoboy.annetom.com • WebApp</p>
          </div>
        </div>

        <button
          onClick={fetchDeliveries}
          className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300"
        >
          🔄 Atualizar
        </button>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 p-4 max-w-xl mx-auto w-full space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-xs">Buscando rotas de entrega...</div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <p className="text-xl">🛵 Nenhuma entrega pendente no momento!</p>
            <p className="text-xs">Novos pedidos atribuídos para entrega aparecerão aqui.</p>
          </div>
        ) : (
          deliveries.map((d) => {
            const addr = d.customer_address || {};
            const fullAddress = `${addr.street || d.address || "Zona Norte"}, ${addr.number || ""}, ${addr.neighborhood || ""}`;
            const encodedMaps = encodeURIComponent(fullAddress);

            return (
              <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-amber-400 font-bold text-xs">
                      #{d.display_code || String(d.id).slice(0, 8)}
                    </span>
                    <h3 className="text-sm font-bold text-white">{d.customer_name || "Cliente"}</h3>
                  </div>

                  <span className="bg-purple-900/60 border border-purple-700 text-purple-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {d.status === "out_for_delivery" ? "🛵 Na Rua" : "⏳ Em Preparo"}
                  </span>
                </div>

                {/* Endereço & Waze/Google Maps */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <p className="text-slate-300 font-medium">📍 {fullAddress}</p>
                  
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodedMaps}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center bg-blue-600/80 hover:bg-blue-600 text-white py-1.5 rounded-lg text-[11px] font-bold"
                    >
                      🗺️ Google Maps
                    </a>
                    <a
                      href={`https://waze.com/ul?q=${encodedMaps}&navigate=yes`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center bg-sky-500/80 hover:bg-sky-500 text-white py-1.5 rounded-lg text-[11px] font-bold"
                    >
                      🚗 Waze
                    </a>
                  </div>
                </div>

                {/* Telefone & Total */}
                <div className="flex justify-between items-center text-xs pt-1">
                  {d.customer_phone && (
                    <a
                      href={`https://wa.me/55${d.customer_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      💬 Falar no WhatsApp
                    </a>
                  )}

                  <span className="font-bold text-emerald-400 text-sm">
                    {formatCurrencyBRL(d.total_final || d.total || 0)}
                  </span>
                </div>

                {/* Botão Concluir Entrega */}
                <button
                  onClick={() => handleMarkDelivered(d.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md mt-2"
                >
                  ✅ Confirmar Entrega Realizada
                </button>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
