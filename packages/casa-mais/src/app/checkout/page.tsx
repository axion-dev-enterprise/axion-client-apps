'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  User as UserIcon,
} from '@/components/Icons';
import {
  formatCPF,
  formatPhone,
  formatCEP,
  formatCardNumber,
  formatCardExpiry,
  cleanDigits,
  fetchAddressByCEP,
} from '@/lib/formatters';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plano') || 'plano-familia';

  const [selectedPlanId, setSelectedPlanId] = useState(planParam);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX_RECURRENT'>('CREDIT_CARD');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [errorNotice, setErrorNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('João da Silva Santos');
  const [email, setEmail] = useState('joao.silva@email.com');
  const [phone, setPhone] = useState('(63) 99234-5678');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [birthDate, setBirthDate] = useState('1988-05-12');
  const [password, setPassword] = useState('SenhaForte123!');

  // Address states
  const [zipCode, setZipCode] = useState('77060-000');
  const [street, setStreet] = useState('Rua das Palmeiras');
  const [number, setNumber] = useState('425');
  const [complement, setComplement] = useState('Casa 02');
  const [neighborhood, setNeighborhood] = useState('Jardim Aureny III');
  const [city, setCity] = useState('Palmas');
  const [state, setState] = useState('TO');

  // Card states
  const [cardNumber, setCardNumber] = useState('5520 8821 3456 7890');
  const [cardHolder, setCardHolder] = useState('JOAO DA SILVA SANTOS');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('458');

  // Plan info map
  const planDetails: Record<string, { name: string; price: number; desc: string }> = {
    'plano-essencial': { name: 'Plano Essencial', price: 29.9, desc: 'Chaveiro, Eletricista, Encanador, Pequenos reparos' },
    'plano-familia': { name: 'Plano Família', price: 49.9, desc: 'Tudo do Essencial + Dedetização anual, Caixa d’Água anual e Preventiva' },
    'plano-premium': { name: 'Plano Premium', price: 79.9, desc: 'Tudo do Família + Eletrodomésticos, 2 Dedetizações e 2 Preventivas' },
  };

  const currentPlan = planDetails[selectedPlanId] || planDetails['plano-familia'];
  const finalPrice = discountPercent > 0 ? currentPlan.price * (1 - discountPercent / 100) : currentPlan.price;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'CASA10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      setCouponError('');
    } else if (couponCode.trim().toUpperCase() === 'BEMVINDO') {
      setDiscountPercent(15);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const handleZipChange = async (val: string) => {
    const formatted = formatCEP(val);
    setZipCode(formatted);
    const digits = cleanDigits(formatted);
    if (digits.length === 8) {
      setLoadingCep(true);
      const addr = await fetchAddressByCEP(digits);
      setLoadingCep(false);
      if (addr) {
        if (addr.street) setStreet(addr.street);
        if (addr.neighborhood) setNeighborhood(addr.neighborhood);
        if (addr.city) setCity(addr.city);
        if (addr.state) setState(addr.state);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          planName: currentPlan.name,
          amount: Number(finalPrice.toFixed(2)),
          paymentMethod,
          user: { name, email, phone, cpf, birthDate, password },
          address: { zipCode, street, number, complement, neighborhood, city, state },
          coupon: couponApplied ? couponCode : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/cliente');
        }, 2000);
      } else {
        setErrorNotice(data.error || 'Falha ao processar assinatura. Verifique os dados do cartão.');
      }
    } catch (err) {
      console.error(err);
      setErrorNotice('Erro de conexão ao processar pagamento. Verifique sua rede e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: '80px 16px', maxWidth: '540px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px 32px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '9999px',
            backgroundColor: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Assinatura Confirmada!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            Parabéns! Sua residência agora está protegida pelo <strong>CASA+</strong>. Suas franquias de utilização já estão ativas.
          </p>
          <div className="badge badge-green" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Redirecionando para seu painel Meu Casa+...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-green" style={{ marginBottom: '8px' }}>CHECKOUT SEGURO</span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Finalize sua Assinatura</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sua casa protegida o ano inteiro em poucos passos.
          </p>
        </div>

        {errorNotice && (
          <div
            role="alert"
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{errorNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorNotice('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontSize: '1.1rem', padding: '4px', lineHeight: 1 }}
              aria-label="Fechar aviso"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column: Customer and Address Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Personal Data */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <UserIcon size={20} color="var(--primary-green)" />
                <span>1. Dados Pessoais</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      WhatsApp / Celular
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(63) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Address Data */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <MapPin size={20} color="var(--primary-green)" />
                <span>2. Endereço Residencial para Atendimento</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        CEP
                      </label>
                      {loadingCep && (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Buscando...</span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="00000-000"
                      value={zipCode}
                      onChange={(e) => handleZipChange(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Logradouro (Rua / Avenida)
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Número
                    </label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Bairro
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      UF
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Plan Summary Card */}
            <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>3. Resumo da Assinatura</h3>

              <div style={{
                border: '1px solid var(--border-card)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: '#f8fafc',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
                    {currentPlan.name}
                  </span>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-card)', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <option value="plano-essencial">Essencial (R$ 29,90)</option>
                    <option value="plano-familia">Família (R$ 49,90)</option>
                    <option value="plano-premium">Premium (R$ 79,90)</option>
                  </select>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  {currentPlan.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mensalidade:</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                    R$ {finalPrice.toFixed(2).replace('.', ',')} / mês
                  </span>
                </div>
              </div>

              {/* Coupon Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Possui cupom de desconto?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ex: CASA10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="btn btn-outline btn-sm"
                  >
                    {couponApplied ? 'Aplicado!' : 'Aplicar'}
                  </button>
                </div>
                {couponApplied && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#16a34a', marginTop: '6px', fontWeight: 600 }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>Cupom {couponCode.toUpperCase()} aplicado ({discountPercent}% OFF)!</span>
                  </span>
                )}
                {couponError && (
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#dc2626', marginTop: '4px' }}>
                    {couponError}
                  </span>
                )}
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Forma de Cobrança Recorrente
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: paymentMethod === 'CREDIT_CARD' ? '2px solid var(--primary-green)' : '1px solid var(--border-card)',
                      backgroundColor: paymentMethod === 'CREDIT_CARD' ? '#f0fdf4' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <CreditCard size={22} color={paymentMethod === 'CREDIT_CARD' ? '#16a34a' : '#64748b'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'CREDIT_CARD' ? '#15803d' : '#475569' }}>
                      Cartão de Crédito
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX_RECURRENT')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: paymentMethod === 'PIX_RECURRENT' ? '2px solid var(--primary-green)' : '1px solid var(--border-card)',
                      backgroundColor: paymentMethod === 'PIX_RECURRENT' ? '#f0fdf4' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <QrCode size={22} color={paymentMethod === 'PIX_RECURRENT' ? '#16a34a' : '#64748b'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'PIX_RECURRENT' ? '#15803d' : '#475569' }}>
                      PIX Automático
                    </span>
                  </button>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'CREDIT_CARD' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NOME COMO NO CARTAO"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(cleanDigits(e.target.value).slice(0, 4))}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  textAlign: 'center',
                  marginBottom: '24px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}>
                  <QrCode size={36} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
                  O QR Code do PIX será gerado na confirmação e a assinatura será liberada instantaneamente com a notificação do Banco Central.
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block"
                style={{ padding: '16px', fontSize: '1.05rem' }}
              >
                {loading ? 'Processando Assinatura...' : `Confirmar Assinatura (R$ ${finalPrice.toFixed(2).replace('.', ',')}/mês)`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.78rem', color: '#64748b' }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span>Ambiente Seguro SSL 256-bit. Cancele quando quiser sem multas.</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Carregando checkout seguro...</p>
        </div>
      </div>
    }>
      <CheckoutForm />
    </React.Suspense>
  );
}
