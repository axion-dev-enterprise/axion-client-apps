'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  User,
  Wrench,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
} from '@/components/Icons';
import { Plan, ServiceItem, ServiceRequest, User as UserType, Provider, Subscription } from '@/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'KPI' | 'REQUESTS' | 'CLIENTS' | 'PROVIDERS' | 'PLANS_SERVICES' | 'CONFIG'>('KPI');
  const [loading, setLoading] = useState(true);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Config editor state (Section 35)
  const [dispatchMode, setDispatchMode] = useState<'NEAREST' | 'BROADCAST'>('NEAREST');
  const [citiesText, setCitiesText] = useState('Palmas, Porto Nacional, Araguaína, Gurupi, Paraíso do Tocantins');
  const [supportPhone, setSupportPhone] = useState('(63) 3215-0000');
  const [savedNotice, setSavedNotice] = useState('');

  const loadAll = async () => {
    try {
      const [resPlans, resSrv, resReq, resUsers, resProv, resSubs, resConf] = await Promise.all([
        fetch('/api/plans').then((r) => r.json()),
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/requests').then((r) => r.json()),
        fetch('/api/admin/users').then((r) => r.json()),
        fetch('/api/providers').then((r) => r.json()),
        fetch('/api/subscriptions').then((r) => r.json()),
        fetch('/api/admin/config').then((r) => r.json()),
      ]);

      if (resPlans.plans) setPlans(resPlans.plans);
      if (resSrv.services) setServices(resSrv.services);
      if (resReq.requests) setRequests(resReq.requests);
      if (resUsers.users) setUsers(resUsers.users);
      if (resProv.providers) setProviders(resProv.providers);
      if (resSubs.subscriptions) setSubscriptions(resSubs.subscriptions);
      if (resConf.config) {
        setDispatchMode(resConf.config.dispatchMode || 'NEAREST');
        setCitiesText((resConf.config.cities || []).join(', '));
        setSupportPhone(resConf.config.supportPhone || '(63) 3215-0000');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleUpdatePlanPrice = async (planId: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/plans/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });
      if (res.ok) {
        setSavedNotice('Preço do plano atualizado com sucesso!');
        loadAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cities = citiesText.split(',').map((c) => c.trim()).filter(Boolean);
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispatchMode,
          cities,
          supportPhone,
        }),
      });
      if (res.ok) {
        setSavedNotice('Configurações globais salvas com sucesso no banco!');
        setTimeout(() => setSavedNotice(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPIs calculations (Section 16 & 21)
  const activeSubsCount = subscriptions.filter((s) => s.status === 'ACTIVE').length;
  const mrr = subscriptions
    .filter((s) => s.status === 'ACTIVE')
    .reduce((acc, s) => acc + (s.amount || 0), 0);
  const arr = mrr * 12;
  const openCallsCount = requests.filter((r) => r.status !== 'COMPLETED' && r.status !== 'CANCELED').length;
  const completedCallsCount = requests.filter((r) => r.status === 'COMPLETED').length;
  const activeProvidersCount = providers.filter((p) => p.status === 'APPROVED').length;

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '32px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '28px',
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PAINEL ADMINISTRATIVO MASTER
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginTop: '4px' }}>
              Gestão Central CASA+
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Controle executivo de planos, clientes, prestadores e despacho de atendimentos.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/cliente" className="btn btn-outline btn-sm">
              Ver Como Cliente
            </Link>
            <Link href="/prestador" className="btn btn-outline btn-sm">
              Ver Como Prestador
            </Link>
          </div>
        </div>

        {savedNotice && (
          <div style={{
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            {savedNotice}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-card)',
          marginBottom: '32px',
          paddingBottom: '2px',
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('KPI')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'KPI' ? 'var(--primary-navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'KPI' ? '3px solid var(--primary-green)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Indicadores (KPIs)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REQUESTS')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'REQUESTS' ? 'var(--primary-navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'REQUESTS' ? '3px solid var(--primary-green)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Despacho de Chamados ({openCallsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CLIENTS')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'CLIENTS' ? 'var(--primary-navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'CLIENTS' ? '3px solid var(--primary-green)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Gestão de Clientes ({users.filter((u) => u.role === 'CLIENT').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PROVIDERS')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'PROVIDERS' ? 'var(--primary-navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'PROVIDERS' ? '3px solid var(--primary-green)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Rede de Prestadores ({providers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PLANS_SERVICES')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'PLANS_SERVICES' ? 'var(--primary-navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'PLANS_SERVICES' ? '3px solid var(--primary-green)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Planos & Franquias (Dinâmico)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CONFIG')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeTab === 'CONFIG' ? 'var(--primary-navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'CONFIG' ? '3px solid var(--primary-green)' : '3px solid transparent',
              cursor: 'pointer',
            }}
          >
            Regras & Cidades (Zero Hardcode)
          </button>
        </div>

        {/* TAB 1: EXECUTIVE KPIS (SECTION 16 & 21) */}
        {activeTab === 'KPI' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}>
              <div className="card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>MRR (RECEITA MENSAL)</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginTop: '6px' }}>
                  R$ {mrr.toFixed(2).replace('.', ',')}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>ARR: R$ {arr.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ASSINANTES ATIVOS</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginTop: '6px' }}>
                  {activeSubsCount}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>Inadimplência: 0%</span>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CHAMADOS EM ANDAMENTO</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#d97706', marginTop: '6px' }}>
                  {openCallsCount}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Concluídos: {completedCallsCount}</span>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRESTADORES ATIVOS</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginTop: '6px' }}>
                  {activeProvidersCount}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>Tempo médio: 42 min</span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>DRE Operacional & Margens do CASA+ (Seção 33)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ticket Médio Mensal:</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>R$ 49,90</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Custo Médio por Chamado:</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>R$ 80,00</div>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Margem de Contribuição:</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>68%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUESTS DESPACHO (SECTION 11 & 12) */}
        {activeTab === 'REQUESTS' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Fila Geral de Chamados</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Protocolo</th>
                    <th style={{ padding: '12px 8px' }}>Cliente</th>
                    <th style={{ padding: '12px 8px' }}>Serviço</th>
                    <th style={{ padding: '12px 8px' }}>Local</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Técnico</th>
                    <th style={{ padding: '12px 8px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{r.protocolCode}</td>
                      <td style={{ padding: '12px 8px' }}>{r.clientName}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{r.serviceName}</td>
                      <td style={{ padding: '12px 8px' }}>{r.neighborhood}, {r.city}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="badge badge-green">{r.status}</span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{r.assignedProviderName || 'Aguardando Despacho'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <Link href={`/cliente/chamados/${r.id}`} className="btn btn-outline btn-sm">
                          Inspecionar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENTS (SECTION 17) */}
        {activeTab === 'CLIENTS' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Base de Clientes Cadastrados</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Nome</th>
                    <th style={{ padding: '12px 8px' }}>E-mail</th>
                    <th style={{ padding: '12px 8px' }}>Telefone</th>
                    <th style={{ padding: '12px 8px' }}>CPF</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter((u) => u.role === 'CLIENT').map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '12px 8px' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>{u.phone}</td>
                      <td style={{ padding: '12px 8px' }}>{u.cpf}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="badge badge-green">{u.status}</span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROVIDERS (SECTION 18) */}
        {activeTab === 'PROVIDERS' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Rede de Prestadores Credenciados</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px' }}>Nome</th>
                    <th style={{ padding: '12px 8px' }}>Categoria</th>
                    <th style={{ padding: '12px 8px' }}>Cidade</th>
                    <th style={{ padding: '12px 8px' }}>Avaliação</th>
                    <th style={{ padding: '12px 8px' }}>Atendimentos</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '12px 8px' }}>{p.category}</td>
                      <td style={{ padding: '12px 8px' }}>{p.city}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: '#f59e0b' }}>⭐ {p.ratingAverage}</td>
                      <td style={{ padding: '12px 8px' }}>{p.completedCallsCount}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="badge badge-green">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PLANS & SERVICES (DYNAMIC PRICING & LIMITS) */}
        {activeTab === 'PLANS_SERVICES' && (
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Gestão Dinâmica de Planos & Franquias (Seção 19 & 35)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Edite valores mensais e regras diretamente pela interface. Todas as alterações refletem imediatamente no site e checkout.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {plans.map((pl) => (
                <div key={pl.id} style={{ border: '1px solid var(--border-card)', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{pl.name}</h4>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Valor Mensalidade (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      defaultValue={pl.price}
                      onBlur={(e) => handleUpdatePlanPrice(pl.id, parseFloat(e.target.value))}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '1.1rem', fontWeight: 700, width: '120px' }}
                    />
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {pl.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL CONFIG (SECTION 35 ZERO HARDCODE) */}
        {activeTab === 'CONFIG' && (
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Configurações Operacionais & Estratégia de Despacho (Seção 12 & 35)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Alterne o modelo de distribuição de chamados e gerencie cidades habilitadas.
            </p>

            <form onSubmit={handleSaveConfig} style={{ maxWidth: '600px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Estratégia de Despacho para Prestadores (Seção 12)
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="dispatchMode"
                      value="NEAREST"
                      checked={dispatchMode === 'NEAREST'}
                      onChange={() => setDispatchMode('NEAREST')}
                    />
                    <span>A) Enviar para o prestador mais próximo (Raio GPS)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="dispatchMode"
                      value="BROADCAST"
                      checked={dispatchMode === 'BROADCAST'}
                      onChange={() => setDispatchMode('BROADCAST')}
                    />
                    <span>B) Enviar para vários simultaneamente</span>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Cidades Habilitadas na Plataforma (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={citiesText}
                  onChange={(e) => setCitiesText(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Telefone da Central de Atendimento ao Cliente
                </label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Salvar Configurações no Banco
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
