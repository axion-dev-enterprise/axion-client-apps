import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../lib/supabase";
import { formatCurrencyBRL } from "../utils/menu";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vendas");

  const [metrics, setMetrics] = useState({
    totalVendas: 0,
    totalPedidos: 0,
    ticketMedio: 0,
    pixCount: 0,
    cartaoCount: 0,
  });

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: supaOrders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: supaCust } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      const ordList = supaOrders || [];
      const custList = supaCust || [];

      setOrders(ordList);
      setCustomers(custList);

      let totalV = 0;
      let pixC = 0;
      let cartC = 0;

      ordList.forEach((o) => {
        const val = Number(o.total_final || o.total || 0);
        totalV += val;
        const pMethod = String(o.payment_method || o.pagamento || "").toLowerCase();
        if (pMethod.includes("pix")) pixC++;
        else cartC++;
      });

      const count = ordList.length;
      setMetrics({
        totalVendas: totalV,
        totalPedidos: count,
        ticketMedio: count > 0 ? totalV / count : 0,
        pixCount: pixC,
        cartaoCount: cartC,
      });
    } catch (err) {
      console.error("[Admin] Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const exportOrdersCSV = () => {
    if (!orders || orders.length === 0) return alert("Nenhum pedido para exportar.");
    const headers = ["ID", "Cliente", "Telefone", "Status", "Forma Pagamento", "Total (R$)", "Data"];
    const rows = orders.map((o) => [
      o.display_code || o.id,
      `"${o.customer_name || 'Cliente'}"`,
      `"${o.customer_phone || ''}"`,
      o.status || 'Concluído',
      o.payment_method || 'Pix',
      Number(o.total_final || o.total || 0).toFixed(2),
      new Date(o.created_at).toLocaleString("pt-BR"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dre_vendas_annetom_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER ADMIN */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logopizzaria.png" alt="Anne & Tom" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-amber-400">Painel Administrativo</h1>
              <p className="text-xs text-slate-400">admin.annetom.com • Gestão Integrada</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportOrdersCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            📥 Exportar CSV
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            🖨️ Imprimir DRE
          </button>

          <div className="flex gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab("vendas")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "vendas" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              📊 Vendas &amp; DRE
            </button>
            <button
              onClick={() => setActiveTab("clientes")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "clientes" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              👥 Clientes VIP ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab("estoque")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === "estoque" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              🧀 Insumos / Estoque
            </button>
          </div>
        </div>
      </header>

      {/* METRICAS TOPO */}
      <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Faturamento Total</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {formatCurrencyBRL(metrics.totalVendas)}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Pedidos Realizados</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{metrics.totalPedidos}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Ticket Médio</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {formatCurrencyBRL(metrics.ticketMedio)}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Formas de Pagamento</p>
          <p className="text-xs text-slate-300 mt-2 flex justify-between">
            <span>Pix: <strong className="text-emerald-400">{metrics.pixCount}</strong></span>
            <span>Cartão: <strong className="text-blue-400">{metrics.cartaoCount}</strong></span>
          </p>
        </div>
      </div>

      {/* MAIN CONTENT TAB */}
      <main className="flex-1 px-6 pb-10 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Carregando dados administrativos...</div>
        ) : activeTab === "vendas" ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-amber-400">Histórico Recente de Pedidos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Código</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Telefone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-amber-300">
                        #{o.display_code || String(o.id).slice(0, 8)}
                      </td>
                      <td className="p-3 font-medium text-white">{o.customer_name || "Cliente"}</td>
                      <td className="p-3 text-slate-400">{o.customer_phone || "-"}</td>
                      <td className="p-3">
                        <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full text-[10px] text-emerald-400 font-semibold">
                          {o.status || "Concluído"}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        {formatCurrencyBRL(o.total_final || o.total || 0)}
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(o.created_at).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "clientes" ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-amber-400">Base de Clientes Anne &amp; Tom</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm">{c.name}</h3>
                    {c.is_subscriber && (
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                        ⭐ CLUBE VIP
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400">📱 {c.phone}</p>
                  <p className="text-emerald-400 font-semibold">Pontos Acumulados: {c.points || 0} pts</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-amber-400">Controle de Insumos &amp; Estoque</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-white">🧀 Queijo Mussarela Especial</p>
                <p className="text-slate-400 mt-1">Estoque: 45 kg (OK)</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-white">🥫 Molho de Tomate Italiano</p>
                <p className="text-slate-400 mt-1">Estoque: 60 L (OK)</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <p className="font-bold text-white">📦 Embalagens Pizza 35cm</p>
                <p className="text-slate-400 mt-1">Estoque: 350 unidades (OK)</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
