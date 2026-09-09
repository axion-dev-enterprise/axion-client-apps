'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Zap,
  Droplets,
  Key,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Star,
  DollarSign,
  User,
} from '@/components/Icons';
import { ServiceRequest } from '@/types';

export default function ProviderDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeJob, setActiveJob] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Completion Form States (Section 14)
  const [completionSummary, setCompletionSummary] = useState('');
  const [clientPresent, setClientPresent] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
        // Find if provider Carlos has an active job in progress or dispatched
        const active = data.requests.find(
          (r: ServiceRequest) =>
            r.assignedProviderId === 'prov-carlos' &&
            (r.status === 'DISPATCHED' || r.status === 'IN_PROGRESS')
        );
        setActiveJob(active || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptJob = async (reqId: string) => {
    setActionNotice('Aceitando chamado e notificando cliente...');
    try {
      const res = await fetch(`/api/requests/${reqId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'DISPATCHED',
          providerId: 'prov-carlos',
          providerName: 'Carlos Eduardo Ferreira',
          providerPhone: '(63) 98411-2233',
        }),
      });
      if (res.ok) {
        setActionNotice('Chamado aceito com sucesso! Você está a caminho.');
        loadData();
      }
    } catch (err) {
      console.error(err);
      setActionNotice('Falha ao aceitar chamado.');
    }
  };

  const handleStartService = async () => {
    if (!activeJob) return;
    try {
      await fetch(`/api/requests/${activeJob.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) return;
    setFinishing(true);

    try {
      const res = await fetch(`/api/requests/${activeJob.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'prov-carlos',
          serviceSummary: completionSummary || 'Serviço concluído conforme o padrão técnico CASA+.',
          clientPresent,
          photosBefore: ['/logo.png'],
          photosAfter: ['/logo.png'],
        }),
      });

      if (res.ok) {
        setActionNotice('Atendimento finalizado com sucesso! Protocolo fechado.');
        setCompletionSummary('');
        loadData();
      }
    } catch (err) {
      console.error(err);
      setActionNotice('Falha ao finalizar atendimento.');
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '32px 0 60px 0' }}>
      <div className="container">
        {/* Provider Profile Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PORTAL DO PRESTADOR PARCEIRO
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginTop: '4px' }}>
              Painel Operacional
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Prestador: <strong>Carlos Eduardo Ferreira</strong> (Eletricista Homologado)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                <Star size={18} filled />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1 }}>4.9</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>42 Atendimentos</div>
              </div>
            </div>

            <div className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ color: '#16a34a' }}>
                <DollarSign size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', lineHeight: 1 }}>R$ 1.840</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Repasses no mês</div>
              </div>
            </div>
          </div>
        </div>

        {actionNotice && (
          <div style={{
            padding: '14px 20px',
            borderRadius: '10px',
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            fontSize: '0.95rem',
            fontWeight: 600,
            marginBottom: '24px',
          }}>
            {actionNotice}
          </div>
        )}

        {/* ACTIVE JOB SECTION (SECTION 13 & 14) */}
        {activeJob ? (
          <div className="card" style={{ padding: '32px', marginBottom: '36px', border: '2px solid var(--primary-green)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-green" style={{ marginBottom: '8px' }}>
                  {activeJob.status === 'DISPATCHED' ? 'A CAMINHO' : 'EM ATENDIMENTO'}
                </span>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)' }}>
                  {activeJob.protocolCode} — {activeJob.serviceName}
                </h2>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Cliente:</span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
                  {activeJob.clientName}
                </div>
              </div>
            </div>

            {/* Address and Contact Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Endereço do Atendimento:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--primary-navy)' }}>
                  <MapPin size={16} color="var(--primary-green)" />
                  <span>{activeJob.addressSummary}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeJob.addressSummary)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Google Maps
                  </a>
                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent(activeJob.addressSummary)}&navigate=yes`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Navegar com Waze
                  </a>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Telefone do Cliente:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Phone size={16} color="var(--primary-green)" />
                  <span>{activeJob.clientPhone}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  <a href={`tel:${activeJob.clientPhone}`} className="btn btn-navy btn-sm">
                    Ligar
                  </a>
                  <a
                    href={`https://wa.me/55${activeJob.clientPhone.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20sou%20o%20t%C3%A9cnico%20CASA%2B%20a%20caminho%20do%20seu%20atendimento.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                DESCRIÇÃO DO PROBLEMA INFORMADA PELO CLIENTE:
              </span>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                "{activeJob.description}"
              </p>
            </div>

            {/* In-service action toggle */}
            {activeJob.status === 'DISPATCHED' && (
              <div style={{ marginBottom: '32px' }}>
                <button
                  type="button"
                  onClick={handleStartService}
                  className="btn btn-navy"
                  style={{ padding: '14px 28px' }}
                >
                  Cheguei ao Local • Iniciar Atendimento
                </button>
              </div>
            )}

            {/* FINALIZAÇÃO DO SERVIÇO (SECTION 14) */}
            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
                Finalização do Atendimento
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Preencha os dados do serviço concluído para registrar no protocolo e liberar a comissão.
              </p>

              <form onSubmit={handleFinishService}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Serviço Realizado (Diagnóstico Técnico & Solução Aplicada)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ex: Identificado disjuntor de 20A subdimensionado para chuveiro de 7500W. Substituído por disjuntor de 40A e fiação de 6mm com reaperto geral no quadro."
                    value={completionSummary}
                    onChange={(e) => setCompletionSummary(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={clientPresent}
                      onChange={(e) => setClientPresent(e.target.checked)}
                    />
                    <span>Cliente estava presente na residência</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={finishing}
                  className="btn btn-primary"
                  style={{ padding: '14px 32px', fontSize: '1.05rem' }}
                >
                  {finishing ? 'Encerrando Chamado...' : 'FINALIZAR ATENDIMENTO'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: '36px', backgroundColor: '#f0fdf4' }}>
            <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#15803d' }}>Você está disponível para novos chamados</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Quando um cliente abrir uma solicitação em Palmas/Jardim Aureny, ela aparecerá aqui instantaneamente.
            </p>
          </div>
        )}

        {/* CHAMADOS DISPONÍVEIS NA REGIÃO (SECTION 13) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Chamados Disponíveis na Região</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Oportunidades filtradas por sua especialidade e raio de atuação.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {requests
              .filter((r) => r.status === 'OPEN' || r.status === 'IN_REVIEW' || r.status === 'PROVIDER_LOCATED')
              .map((req) => (
                <div
                  key={req.id}
                  className="card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '1.2rem' }}>{req.serviceName}</h4>
                      <span className="badge badge-amber">3,2 km • {req.neighborhood}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '550px', marginBottom: '8px' }}>
                      {req.description}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Atendimento Casa+ • Remuneração negociada: <strong>R$ 90,00</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleAcceptJob(req.id)}
                      className="btn btn-primary btn-sm"
                    >
                      ACEITAR
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                    >
                      RECUSAR
                    </button>
                  </div>
                </div>
              ))}

            {requests.filter((r) => r.status === 'OPEN' || r.status === 'IN_REVIEW' || r.status === 'PROVIDER_LOCATED').length === 0 && (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhum chamado pendente no momento na sua microrregião.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
