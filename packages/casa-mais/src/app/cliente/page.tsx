import React from 'react';
import Link from 'next/link';
import { db } from '@/data/db';
import {
  Wrench,
  Zap,
  Droplets,
  Key,
  Bug,
  ShieldCheck,
  Cpu,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  CreditCard,
  ArrowRight,
  User as UserIcon,
  ChevronRight,
} from '@/components/Icons';

export default function ClientDashboardPage() {
  // Demo client João da Silva
  const clientUser = db.getUserById('usr-cliente-joao') || db.getUsers()[1];
  const activeSub = db.getActiveSubscriptionByUserId(clientUser.id);
  const quotas = db.getClientQuotaStatus(clientUser.id);
  const requests = db.getRequestsByUserId(clientUser.id);

  const renewalDate = activeSub?.nextBillingDate
    ? new Date(activeSub.nextBillingDate).toLocaleDateString('pt-BR')
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge-gray">Aberto</span>;
      case 'IN_REVIEW':
        return <span className="badge badge-amber">Em Análise</span>;
      case 'PROVIDER_LOCATED':
        return <span className="badge badge-blue">Técnico Localizado</span>;
      case 'DISPATCHED':
        return <span className="badge badge-green">Técnico a Caminho</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-blue">Em Atendimento</span>;
      case 'COMPLETED':
        return <span className="badge badge-green">Concluído</span>;
      case 'CANCELED':
        return <span className="badge badge-gray">Cancelado</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '32px 0 60px 0' }}>
      <div className="container">
        {/* Top greeting */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PAINEL DO ASSINANTE
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginTop: '4px' }}>
              Meu Casa+
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Olá, <strong>{clientUser.name}</strong>. Bem-vindo à sua central de assistência.
            </p>
          </div>

          <Link
            href="/cliente/chamados/novo"
            className="btn btn-primary"
            style={{ padding: '14px 24px', fontSize: '1rem' }}
          >
            <Plus size={20} />
            <span>Solicitar Nova Assistência</span>
          </Link>
        </div>

        {/* Top Info Grid: Plan Card & Billing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {/* Active Plan Card */}
          <div className="card" style={{ padding: '24px', background: 'var(--primary-navy)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase' }}>
                  PLANO ATIVO
                </span>
                <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '4px' }}>
                  {activeSub?.planName || 'Plano Família'}
                </h3>
              </div>
              <span className="badge badge-green" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                Ativo
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                R$ {activeSub?.amount.toFixed(2).replace('.', ',') || '49,90'}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/ mês</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Calendar size={16} color="#22c55e" />
              <span>Próxima renovação em <strong>{renewalDate}</strong></span>
            </div>
          </div>

          {/* Quick Stats / Emergency Support */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                CENTRAL DE ATENDIMENTO
              </span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginTop: '4px', marginBottom: '8px' }}>
                Suporte Emergencial 24h
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Em casos de emergência (cano estourado, perda de chave ou pane geral de energia), nosso despacho é prioritário.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <a
                href="https://wa.me/5563992345678"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>WhatsApp Plantão</span>
              </a>
              <Link
                href="/cliente/chamados/novo"
                className="btn btn-navy btn-sm"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>Abrir Chamado</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits & Available Quotas Grid (Section 9 & 20) */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Benefícios & Franquias Disponíveis</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Consulte o saldo de utilizações inclusas no seu plano durante o ciclo anual.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
          }}>
            {quotas.map((quota) => (
              <div
                key={quota.serviceId}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${quota.color}`,
                  opacity: quota.includedInPlan ? 1 : 0.6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: `${quota.color}15`,
                    color: quota.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {quota.category === 'ENCANAMENTO' && <Droplets size={20} />}
                    {quota.category === 'ELETRICIDADE' && <Zap size={20} />}
                    {quota.category === 'CHAVEIRO' && <Key size={20} />}
                    {quota.category === 'PEQUENOS_REPAROS' && <Wrench size={20} />}
                    {quota.category === 'DEDETIZACAO' && <Bug size={20} />}
                    {quota.category === 'CAIXA_DAGUA' && <ShieldCheck size={20} />}
                    {quota.category === 'ELETRODOMESTICOS' && <Cpu size={20} />}
                  </div>

                  {quota.includedInPlan ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: quota.available > 0 ? '#16a34a' : '#ea580c' }}>
                      {quota.available} disponível{quota.available !== 1 ? 'is' : ''}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Não incluso</span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{quota.serviceName}</h4>

                <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Utilizado: {quota.used} de {quota.limit}</span>
                    <span>{quota.includedInPlan ? `${Math.round((quota.used / (quota.limit || 1)) * 100)}%` : '-'}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${quota.includedInPlan ? Math.min(100, (quota.used / (quota.limit || 1)) * 100) : 0}%`,
                      height: '100%',
                      backgroundColor: quota.color,
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Service Requests List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Histórico de Chamados</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Acompanhe o status dos seus atendimentos em tempo real.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {requests.map((req) => (
              <div
                key={req.id}
                className="card card-hover"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                {/* Request details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}>
                    {req.protocolCode}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>{req.serviceName}</h4>
                      {getStatusBadge(req.status)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
                      {req.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {req.neighborhood}, {req.city}
                      </span>
                      {req.assignedProviderName && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-navy)', fontWeight: 600 }}>
                          <Wrench size={14} color="#16a34a" /> Técnico: {req.assignedProviderName}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> Aberto em {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Link */}
                <Link
                  href={`/cliente/chamados/${req.id}`}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Ver Detalhes</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
