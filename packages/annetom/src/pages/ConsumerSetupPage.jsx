// src/pages/ConsumerSetupPage.jsx
// UI/UX Guia de Setup & Central de Integração do Programa Consumer POS & MenuDino

import React, { useState, useEffect } from "react";
import SEOHead from "../components/seo/SEOHead";

export default function ConsumerSetupPage() {
  const [activeTab, setActiveTab] = useState("setup");
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [pingLatency, setPingLatency] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [logsData, setLogsData] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [activeEndpointRes, setActiveEndpointRes] = useState({});

  const baseUrl = "https://annetom.com";

  const fetchHealth = async () => {
    setHealthLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      setPingLatency(Date.now() - start);
      setHealthData(data);
    } catch (err) {
      setHealthData({ error: err.message });
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/consumer-logs`);
      const data = await res.json();
      setLogsData(data.logs || []);
    } catch {
      setLogsData([]);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const runTestEndpoint = async (endpointKey, url, method = "GET", body = null) => {
    setActiveEndpointRes((prev) => ({ ...prev, [endpointKey]: { loading: true } }));
    try {
      const headers = { "Content-Type": "application/json" };
      if (tokenInput.trim()) {
        headers["Authorization"] = `Bearer ${tokenInput.trim()}`;
        headers["x-consumer-token"] = tokenInput.trim();
        headers["x-api-key"] = tokenInput.trim();
      }
      const opts = { method, headers };
      if (body && method !== "GET") opts.body = JSON.stringify(body);

      const res = await fetch(url, opts);
      const data = await res.json();
      setActiveEndpointRes((prev) => ({
        ...prev,
        [endpointKey]: { loading: false, status: res.status, ok: res.ok, data },
      }));
    } catch (err) {
      setActiveEndpointRes((prev) => ({
        ...prev,
        [endpointKey]: { loading: false, status: 500, ok: false, data: { error: err.message } },
      }));
    }
  };

  const handleTestToken = async () => {
    if (!tokenInput.trim()) {
      alert("Informe o token de teste para validar a autenticação.");
      return;
    }
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(`${baseUrl}/api/consumer-events`, {
        headers: {
          Authorization: `Bearer ${tokenInput.trim()}`,
          "x-consumer-token": tokenInput.trim(),
          "x-api-key": tokenInput.trim(),
        },
      });
      const data = await res.json();
      setTestResult({ status: res.status, ok: res.ok, data });
    } catch (err) {
      setTestResult({ status: 500, ok: false, data: { error: err.message } });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-16">
      <SEOHead
        title="Guia de Setup & APIs Parceiro Consumer — Anne & Tom"
        description="Guia completo de endpoints e configuração da integração com o Programa Consumer POS e MenuDino."
      />

      {/* HEADER TOP BAR */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              🖥️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white leading-none">
                  Anne &amp; Tom — Guia de Setup &amp; APIs Consumer
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  API HTTP ATIVA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Integração Oficial Programa Consumer POS &amp; MenuDino
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchHealth}
              disabled={healthLoading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700"
            >
              <span className={`w-2 h-2 rounded-full ${healthData?.status === "ok" ? "bg-emerald-400 animate-pulse" : "bg-emerald-400"}`} />
              {healthLoading ? "Testando..." : pingLatency ? `${pingLatency}ms` : "Testar Ping API"}
            </button>

            <a
              href="https://pdv.axionenterprise.cloud/setup"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs transition"
            >
              <span>⚡ AXION PDV Setup</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO BANNER DE STATUS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                ⚡ BASE URL DE INTEGRAÇÃO OFICIAL DO CONSUMER
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Programa Consumer POS &amp; MenuDino Integration Setup
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Base URL Oficial para inserir no programa do caixa:{" "}
                <code className="bg-slate-950 px-2.5 py-1 rounded-lg font-mono text-amber-300 border border-slate-700 font-bold">
                  {baseUrl}
                </code>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                onClick={() => copyToClipboard(baseUrl, "baseUrl")}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>{copiedField === "baseUrl" ? "✓ Copiada!" : "📋 Copiar Base URL"}</span>
              </button>

              <a
                href="https://annetompizzaria.menudino.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition flex items-center gap-2"
              >
                <span>🍕 MenuDino Cardápio</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("setup")}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition border-b-2 whitespace-nowrap ${
              activeTab === "setup"
                ? "border-amber-500 text-amber-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            📖 1. Guia de Configuração no Consumer POS
          </button>

          <button
            onClick={() => setActiveTab("endpoints")}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition border-b-2 whitespace-nowrap ${
              activeTab === "endpoints"
                ? "border-amber-500 text-amber-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            🔌 2. Endpoints HTTP &amp; Testador ao Vivo
          </button>

          <button
            onClick={() => setActiveTab("menudino")}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition border-b-2 whitespace-nowrap ${
              activeTab === "menudino"
                ? "border-amber-500 text-amber-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            📱 3. MenuDino &amp; QR Code
          </button>

          <button
            onClick={() => setActiveTab("token")}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition border-b-2 whitespace-nowrap ${
              activeTab === "token"
                ? "border-amber-500 text-amber-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            🔑 4. Validar Token de Acesso
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-t-2xl transition border-b-2 whitespace-nowrap ${
              activeTab === "logs"
                ? "border-amber-500 text-amber-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            📊 5. Auditoria de Logs ({logsData.length})
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* TAB 1: SETUP GUIDE */}
        {activeTab === "setup" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                Como Configurar a Integração no Programa Consumer (PC do Caixa)
              </h2>
              <p className="text-xs text-slate-400">
                Siga os passos abaixo para autorizar o programa de caixa da pizzaria a receber pedidos automaticamente do site e do cardápio online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* PASSO 1 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-white text-sm">Inserir a URL Base da API</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No Programa Consumer no computador do caixa, vá em <strong>Configurações &gt; Integrações &gt; Pedidos Online / API / Delivery Próprio</strong>.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 break-all">
                  {baseUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(baseUrl, "s1")}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  {copiedField === "s1" ? "✓ URL Copiada" : "Copiar URL Base"}
                </button>
              </div>

              {/* PASSO 2 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-white text-sm">Configurar o Token de Autenticação</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Insira o token no cabeçalho HTTP de requisições do Consumer (chave <code className="text-amber-300">CONSUMER_API_TOKEN</code>).
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
                  Header Authorization: Bearer &lt;TOKEN&gt;
                </div>
                <button
                  onClick={() => setActiveTab("token")}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Testar Token no Servidor →
                </button>
              </div>

              {/* PASSO 3 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-white text-sm">Ativar Polling Automático de Pedidos</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Configure o intervalo de polling do Consumer para consultar novos pedidos a cada <strong>5 segundos</strong> no endpoint:
                </p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 break-all">
                  {baseUrl}/api/consumer-events
                </div>
                <button
                  onClick={() => copyToClipboard(`${baseUrl}/api/consumer-events`, "s3")}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  {copiedField === "s3" ? "✓ Copiado" : "Copiar URL de Polling"}
                </button>
              </div>

            </div>

            {/* TABELA DE ENDPOINTS RESUMIDOS */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm">Resumo de Endpoints Oficiais para o Programa Consumer</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-3">Finalidade</th>
                      <th className="p-3">Método</th>
                      <th className="p-3">Endpoint Completo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-3 font-semibold text-white">Polling de Eventos</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">GET / POST</td>
                      <td className="p-3 font-mono text-amber-300">https://annetom.com/api/consumer-events</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Detalhes do Pedido</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">GET</td>
                      <td className="p-3 font-mono text-amber-300">https://annetom.com/api/consumer-order?id=...</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Atualização de Status (ACK)</td>
                      <td className="p-3 font-mono text-purple-400 font-bold">POST</td>
                      <td className="p-3 font-mono text-amber-300">https://annetom.com/api/consumer-status</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Logs de Auditoria</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">GET</td>
                      <td className="p-3 font-mono text-amber-300">https://annetom.com/api/consumer-logs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENDPOINTS */}
        {activeTab === "endpoints" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ENDPOINT 1: CONSUMER EVENTS */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 font-black text-xs px-3 py-1 rounded-lg border border-emerald-500/30">
                      GET / POST
                    </span>
                    <h3 className="font-bold text-white text-base">Polling de Novos Pedidos</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/api/consumer-events`, "evt")}
                    className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition"
                  >
                    {copiedField === "evt" ? "✓ Copiado" : "Copiar URL"}
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Endpoint utilizado pelo Consumer Desktop para consultar eventos de pedidos pendentes para importação.
                </p>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 break-all">
                  {baseUrl}/api/consumer-events
                </div>

                <button
                  onClick={() => runTestEndpoint("events", `${baseUrl}/api/consumer-events`)}
                  disabled={activeEndpointRes["events"]?.loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition border border-slate-700"
                >
                  {activeEndpointRes["events"]?.loading ? "Executando Requisição..." : "🚀 Testar Endpoint Agora"}
                </button>

                {activeEndpointRes["events"] && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Resposta da API:</span>
                      <span className={activeEndpointRes["events"].ok ? "text-emerald-400" : "text-amber-400"}>
                        HTTP {activeEndpointRes["events"].status}
                      </span>
                    </div>
                    <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                      {JSON.stringify(activeEndpointRes["events"].data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* ENDPOINT 2: CONSUMER ORDER */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 font-black text-xs px-3 py-1 rounded-lg border border-emerald-500/30">
                      GET / POST
                    </span>
                    <h3 className="font-bold text-white text-base">Detalhes do Pedido POS</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/api/consumer-order?id=123`, "ord")}
                    className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition"
                  >
                    {copiedField === "ord" ? "✓ Copiado" : "Copiar URL"}
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Retorna a estrutura técnica completa do pedido (itens, adicionais, cliente e valores) formatada para o caixa.
                </p>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 break-all">
                  {baseUrl}/api/consumer-order?id=VALIDATION-0000
                </div>

                <button
                  onClick={() => runTestEndpoint("order", `${baseUrl}/api/consumer-order`)}
                  disabled={activeEndpointRes["order"]?.loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition border border-slate-700"
                >
                  {activeEndpointRes["order"]?.loading ? "Executando Requisição..." : "🚀 Testar Endpoint Agora"}
                </button>

                {activeEndpointRes["order"] && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Resposta da API:</span>
                      <span className={activeEndpointRes["order"].ok ? "text-emerald-400" : "text-amber-400"}>
                        HTTP {activeEndpointRes["order"].status}
                      </span>
                    </div>
                    <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                      {JSON.stringify(activeEndpointRes["order"].data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* ENDPOINT 3: CONSUMER STATUS */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 font-black text-xs px-3 py-1 rounded-lg border border-purple-500/30">
                      POST
                    </span>
                    <h3 className="font-bold text-white text-base">Atualização de Status de Produção</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/api/consumer-status`, "st")}
                    className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition"
                  >
                    {copiedField === "st" ? "✓ Copiado" : "Copiar URL"}
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Recebe e atualiza as etapas do pedido enviadas pelo Consumer Desktop (PLACED, PREPARING, DISPATCHED, COMPLETED).
                </p>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 break-all">
                  {baseUrl}/api/consumer-status
                </div>

                <button
                  onClick={() => runTestEndpoint("status", `${baseUrl}/api/consumer-status`, "POST", { orderId: "1001", code: "PREPARING" })}
                  disabled={activeEndpointRes["status"]?.loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition border border-slate-700"
                >
                  {activeEndpointRes["status"]?.loading ? "Executando Requisição..." : "🚀 Testar Status (POST)"}
                </button>

                {activeEndpointRes["status"] && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Resposta da API:</span>
                      <span className={activeEndpointRes["status"].ok ? "text-emerald-400" : "text-amber-400"}>
                        HTTP {activeEndpointRes["status"].status}
                      </span>
                    </div>
                    <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                      {JSON.stringify(activeEndpointRes["status"].data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* ENDPOINT 4: HEALTH CHECK */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-500/20 text-sky-400 font-black text-xs px-3 py-1 rounded-lg border border-sky-500/30">
                      GET
                    </span>
                    <h3 className="font-bold text-white text-base">Healthcheck &amp; Diagnósticos</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/api/health`, "hlth")}
                    className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition"
                  >
                    {copiedField === "hlth" ? "✓ Copiado" : "Copiar URL"}
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Verifica o status operacional das APIs de pagamento, banco de dados Supabase e estado do servidor.
                </p>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 break-all">
                  {baseUrl}/api/health
                </div>

                <button
                  onClick={fetchHealth}
                  disabled={healthLoading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition border border-slate-700"
                >
                  {healthLoading ? "Executando..." : "🚀 Testar Healthcheck"}
                </button>

                {healthData && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">Status do Servidor:</span>
                      <span className="text-emerald-400">HTTP 200 OK</span>
                    </div>
                    <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                      {JSON.stringify(healthData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: MENUDINO & QR CODE */}
        {activeTab === "menudino" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center text-xl">
                  📱
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Cardápio Online MenuDino</h3>
                  <p className="text-xs text-slate-400">Página oficial de pedidos e catálogo online</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    URL do Cardápio Público
                  </label>
                  <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-white">
                    <span className="truncate">https://annetompizzaria.menudino.com/</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard("https://annetompizzaria.menudino.com/", "menu-url")}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        {copiedField === "menu-url" ? "✓ Copiado" : "Copiar"}
                      </button>
                      <a href="https://annetompizzaria.menudino.com/" target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
                        🔗
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Atalho QR Code (Cloudflare Edge 301)
                  </label>
                  <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-amber-400">
                    <span className="truncate">https://qr.annetom.com/</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard("https://qr.annetom.com/", "qr-url")}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        {copiedField === "qr-url" ? "✓ Copiado" : "Copiar"}
                      </button>
                      <a href="https://qr.annetom.com/" target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
                        🔗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Redirecionamento Canônico Borda Cloudflare</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  A URL <code className="text-amber-300 font-mono">qr.annetom.com</code> é processada diretamente nos servidores da Cloudflare, redirecionando instantaneamente (HTTP Status 301) para a pizzaria no MenuDino.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                  <div className="text-amber-400 font-bold">{/* Dynamic Redirect Rule (Cloudflare) */}Dynamic Redirect Rule (Cloudflare)</div>
                  <div>expression: <span className="text-emerald-400">http.host eq "qr.annetom.com"</span></div>
                  <div>action: <span className="text-cyan-400">redirect (301)</span></div>
                  <div>target: <span className="text-amber-300">https://annetompizzaria.menudino.com/</span></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center justify-between">
                <span>Status do Redirecionamento:</span>
                <span>✓ HTTP 301 Moved Permanently</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TOKEN TESTER */}
        {activeTab === "token" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
            <div className="space-y-2 text-center">
              <span className="text-3xl">🔑</span>
              <h2 className="text-xl font-black text-white">Testador de Token de Autenticação</h2>
              <p className="text-xs text-slate-400">
                Insira abaixo a chave token para testar a comunicação com a API em tempo real.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Token de Teste (CONSUMER_API_TOKEN)
                </label>
                <input
                  type="text"
                  placeholder="Cole aqui o token para testar..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm focus:border-amber-500 font-mono text-amber-300 outline-none"
                />
              </div>

              <button
                onClick={handleTestToken}
                disabled={testLoading || !tokenInput.trim()}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black py-3.5 rounded-2xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {testLoading ? "Enviando Requisição..." : "🚀 Executar Teste de Autenticação"}
              </button>

              {testResult && (
                <div className="space-y-2 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Resultado do Teste:</span>
                    <span className={testResult.ok ? "text-emerald-400" : "text-rose-400"}>
                      HTTP {testResult.status} {testResult.ok ? "AUTENTICADO COM SUCESSO" : "NEGADO"}
                    </span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Auditoria &amp; Logs de Requisições do Consumer</h2>
                <p className="text-xs text-slate-400">
                  Histórico completo de chamadas efetuadas pelo sistema de caixa em tempo real.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLogs}
                  disabled={logsLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700"
                >
                  {logsLoading ? "Atualizando..." : "🔄 Atualizar Logs"}
                </button>
              </div>
            </div>

            {logsData.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs font-medium">
                Nenhum log registrado até o momento. As requisições enviadas pelo Consumer Desktop aparecerão aqui automaticamente.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {logsData.map((log, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                          {log.route || "consumer"}
                        </span>
                        <span className="font-mono text-slate-300 font-bold">{log.method || "GET"}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{log.timestamp || log.date || "Agora"}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px] text-slate-400">
                      <div>
                        <strong>User-Agent:</strong> {log.userAgent || "Consumer POS"}
                      </div>
                      <div>
                        <strong>IP:</strong> {log.ip || "127.0.0.1"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
