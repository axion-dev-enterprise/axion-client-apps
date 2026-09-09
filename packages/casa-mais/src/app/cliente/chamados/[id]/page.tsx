'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Wrench,
  Zap,
  Droplets,
  Key,
  Bug,
  ShieldCheck,
  Cpu,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Star,
  ChevronRight,
  ArrowRight,
  User,
  Camera,
  Check,
} from '@/components/Icons';
import { ServiceRequest, Review } from '@/types';

export default function CallDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Review states (Section 15)
  const [ratingOverall, setRatingOverall] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingPunctuality, setRatingPunctuality] = useState(5);
  const [ratingQuality, setRatingQuality] = useState(5);
  const [ratingCourtesy, setRatingCourtesy] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/requests/${id}`);
        const data = await res.json();
        if (data.request) {
          setRequest(data.request);
          if (data.request.reviewSubmitted) {
            setReviewSubmitted(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    setReviewSubmitting(true);

    try {
      const res = await fetch(`/api/requests/${request.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: request.assignedProviderId || 'prov-carlos',
          userId: request.userId,
          ratingOverall,
          ratingPunctuality,
          ratingQuality,
          ratingCourtesy,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewSubmitted(true);
        setReviewError('');
      } else {
        setReviewError('Não foi possível registrar sua avaliação. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setReviewError('Erro de conexão ao enviar avaliação.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Carregando dados do chamado...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Chamado Não Encontrado</h2>
        <Link href="/cliente" className="btn btn-navy">Voltar ao Painel</Link>
      </div>
    );
  }

  // 8 states map (Section 11)
  const stepsList = [
    { key: 'OPEN', label: 'Aberto' },
    { key: 'IN_REVIEW', label: 'Em Análise' },
    { key: 'PROVIDER_LOCATED', label: 'Prestador Localizado' },
    { key: 'PENDING_ACCEPT', label: 'Aguardando Aceite' },
    { key: 'DISPATCHED', label: 'Prestador a Caminho' },
    { key: 'IN_PROGRESS', label: 'Em Atendimento' },
    { key: 'COMPLETED', label: 'Serviço Concluído' },
    { key: 'REVIEWED', label: 'Avaliação' },
  ];

  const currentStepIndex = () => {
    switch (request.status) {
      case 'OPEN': return 0;
      case 'IN_REVIEW': return 1;
      case 'PROVIDER_LOCATED': return 2;
      case 'PENDING_ACCEPT': return 3;
      case 'DISPATCHED': return 4;
      case 'IN_PROGRESS': return 5;
      case 'COMPLETED': return reviewSubmitted ? 7 : 6;
      default: return 0;
    }
  };

  const activeIdx = currentStepIndex();

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '36px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link href="/cliente" style={{ color: 'var(--primary-navy)' }}>Meu Casa+</Link>
          <span>/</span>
          <span>Chamado {request.protocolCode}</span>
        </div>

        {/* Top Header Card */}
        <div className="card" style={{ padding: '24px 32px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                  Protocolo {request.protocolCode}
                </span>
                <span className="badge badge-green" style={{ textTransform: 'uppercase' }}>
                  {request.status === 'DISPATCHED' ? 'A CAMINHO' : request.status}
                </span>
              </div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '4px' }}>
                {request.serviceName}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Aberto em {new Date(request.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Endereço de Atendimento:</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
                {request.addressSummary}
              </span>
            </div>
          </div>
        </div>

        {/* Status Stepper (Section 11) */}
        <div className="card" style={{ padding: '28px 24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Fluxo de Acompanhamento em Tempo Real</h3>
          <div style={{ overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, minmax(88px, 1fr))',
              gap: '12px',
              textAlign: 'center',
              minWidth: '700px',
            }}>
              {stepsList.map((st, idx) => {
                const isDone = idx < activeIdx;
                const isCurrent = idx === activeIdx;

                return (
                  <div key={st.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: isDone ? 'var(--primary-green)' : isCurrent ? 'var(--primary-navy)' : '#e2e8f0',
                      color: isDone || isCurrent ? '#ffffff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(11, 37, 69, 0.15)' : 'none',
                    }}>
                      {isDone ? <Check size={16} /> : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--primary-navy)' : isDone ? 'var(--primary-green)' : 'var(--text-muted)',
                      lineHeight: 1.2,
                    }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Assigned Provider Card (Section 9 & 13) */}
        {request.assignedProviderName && (
          <div className="card" style={{ padding: '24px 32px', marginBottom: '28px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-green)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                }}>
                  {request.assignedProviderName.charAt(0)}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                    TÉCNICO HOMOLOGADO A CAMINHO
                  </span>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
                    {request.assignedProviderName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      <Star size={14} filled />
                    </div>
                    <span>{request.assignedProviderRating || '4.9'} • Especialista Verificado</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {request.assignedProviderPhone && (
                  <a
                    href={`tel:${request.assignedProviderPhone}`}
                    className="btn btn-navy btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Phone size={16} />
                    <span>Ligar ({request.assignedProviderPhone})</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Problem Details & Photos */}
        <div className="card" style={{ padding: '28px 32px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Relato do Cliente</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            "{request.description}"
          </p>

          {request.mediaUrls && request.mediaUrls.length > 0 && (
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                FOTOS DO CHAMADO:
              </span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {request.mediaUrls.map((url, i) => (
                  <div key={i} style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-card)', background: '#ffffff' }}>
                    <img src={url} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Completion details if completed */}
        {request.completionDetails && (
          <div className="card" style={{ padding: '28px 32px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '14px' }}>
              Relatório de Conclusão do Atendimento
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {request.completionDetails.serviceSummary}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Cliente presente: <strong>{request.completionDetails.clientPresent ? 'Sim' : 'Não'}</strong></span>
              <span>Concluído em: <strong>{new Date(request.completionDetails.completedAt).toLocaleString('pt-BR')}</strong></span>
            </div>
          </div>
        )}

        {/* Review Section (Section 15) */}
        {request.status === 'COMPLETED' && !reviewSubmitted && (
          <div className="card" style={{ padding: '32px', border: '2px solid var(--primary-green)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="badge badge-green" style={{ marginBottom: '8px' }}>AVALIAÇÃO DO SERVIÇO</span>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)' }}>Como foi seu atendimento?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Sua avaliação garante a qualidade dos técnicos parceiros do CASA+.
              </p>
            </div>

            {reviewError && (
              <div
                role="alert"
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <AlertCircle size={18} color="#dc2626" />
                <span>{reviewError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} style={{ maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                    Nota Geral do Atendimento:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingOverall(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: star <= (hoverRating || ratingOverall) ? '#f59e0b' : '#cbd5e1',
                          transition: 'transform 120ms ease, color 120ms ease',
                          transform: star <= (hoverRating || ratingOverall) ? 'scale(1.15)' : 'scale(1)',
                        }}
                        aria-label={`${star} de 5 estrelas`}
                      >
                        <Star size={26} filled={star <= (hoverRating || ratingOverall)} />
                      </button>
                    ))}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy)', marginLeft: '8px' }}>
                      {ratingOverall === 5 && 'Excelente (5.0)'}
                      {ratingOverall === 4 && 'Muito Bom (4.0)'}
                      {ratingOverall === 3 && 'Regular (3.0)'}
                      {ratingOverall === 2 && 'Ruim (2.0)'}
                      {ratingOverall === 1 && 'Péssimo (1.0)'}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                    Pontualidade do Profissional:
                  </label>
                  <select
                    value={ratingPunctuality}
                    onChange={(e) => setRatingPunctuality(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  >
                    <option value={5}>5 estrelas — Chegou no horário combinado</option>
                    <option value={4}>4 estrelas — Pequeno atraso justificado</option>
                    <option value={3}>3 estrelas — Regular</option>
                    <option value={1}>1 estrela — Muito atrasado</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Conte como foi sua experiência
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="O profissional resolveu o problema? Deixou o local limpo?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-card)' }}
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="btn btn-primary btn-block"
                style={{ padding: '14px' }}
              >
                {reviewSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </form>
          </div>
        )}

        {reviewSubmitted && (
          <div className="card" style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f0fdf4' }}>
            <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#15803d', marginBottom: '4px' }}>
              Obrigado por sua avaliação!
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Sua opinião contribui para mantermos o melhor padrão de qualidade da nossa rede parceira.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
