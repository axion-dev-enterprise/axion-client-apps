'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Zap,
  Droplets,
  Key,
  Bug,
  ShieldCheck,
  Cpu,
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Clock,
  X,
} from '@/components/Icons';
import { formatCEP, cleanDigits, fetchAddressByCEP } from '@/lib/formatters';

export default function NewServiceRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // Form state
  const [selectedCategory, setSelectedCategory] = useState('ELETRICIDADE');
  const [selectedServiceName, setSelectedServiceName] = useState('Eletricista');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'NORMAL' | 'URGENTE'>('NORMAL');
  const [photos, setPhotos] = useState<string[]>([]);
  const [street, setStreet] = useState('Rua das Palmeiras');
  const [number, setNumber] = useState('425');
  const [complement, setComplement] = useState('Casa 02');
  const [neighborhood, setNeighborhood] = useState('Jardim Aureny III');
  const [city, setCity] = useState('Palmas');
  const [zipCode, setZipCode] = useState('77060-000');

  const categories = [
    { id: 'ENCANAMENTO', name: 'Encanamento', icon: Droplets, color: '#0284c7', desc: 'Vazamentos, torneiras e canos' },
    { id: 'ELETRICIDADE', name: 'Eletricidade', icon: Zap, color: '#d97706', desc: 'Disjuntores, tomadas e chuveiros' },
    { id: 'CHAVEIRO', name: 'Chaveiro', icon: Key, color: '#e11d48', desc: 'Portas travadas e cópias' },
    { id: 'PEQUENOS_REPAROS', name: 'Pequenos Reparos', icon: Wrench, color: '#059669', desc: 'Instalações, suportes e dobradiças' },
    { id: 'DEDETIZACAO', name: 'Dedetização', icon: Bug, color: '#ea580c', desc: 'Controle de pragas urbanas' },
    { id: 'CAIXA_DAGUA', name: 'Caixa d’Água', icon: ShieldCheck, color: '#0891b2', desc: 'Limpeza e desinfecção periódica' },
    { id: 'ELETRODOMESTICOS', name: 'Eletrodomésticos', icon: Cpu, color: '#6366f1', desc: 'Geladeiras, lavadoras e fogões' },
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    setSelectedCategory(cat.id);
    setSelectedServiceName(cat.name);
    setErrorNotice('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
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
      }
    }
  };

  const handleSubmitRequest = async () => {
    if (!description.trim()) {
      setErrorNotice('Por favor, descreva o problema no Passo 2.');
      setStep(2);
      return;
    }

    setLoading(true);
    setErrorNotice('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr-cliente-joao',
          clientName: 'João da Silva Santos',
          clientPhone: '(63) 99234-5678',
          category: selectedCategory,
          serviceName: selectedServiceName,
          description,
          mediaUrls: photos.length > 0 ? photos : ['/logo.png'],
          address: {
            street,
            number,
            complement,
            neighborhood,
            city,
            zipCode,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(`/cliente/chamados/${data.request.id}`);
      } else {
        setErrorNotice(data.error || 'Não foi possível registrar o chamado.');
      }
    } catch (err) {
      console.error(err);
      setErrorNotice('Falha de conexão ao enviar chamado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '36px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link href="/cliente" style={{ color: 'var(--primary-navy)' }}>Meu Casa+</Link>
          <span>/</span>
          <span>Abertura de Chamado</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-green" style={{ marginBottom: '8px' }}>ASSISTÊNCIA RESIDENCIAL</span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)' }}>Solicitar Assistência</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Preencha os dados abaixo para localizarmos o profissional mais próximo.
          </p>
        </div>

        {/* Stepper Progress Bar (5 Steps) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '32px',
        }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: step >= i ? 'var(--primary-green)' : '#e2e8f0',
                marginBottom: '6px',
                transition: 'background-color 200ms ease',
              }} />
              <span style={{
                fontSize: '0.75rem',
                fontWeight: step === i ? 700 : 500,
                color: step === i ? 'var(--primary-navy)' : 'var(--text-muted)',
              }}>
                Passo {i}
              </span>
            </div>
          ))}
        </div>

        {errorNotice && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.9rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="card" style={{ padding: '32px 24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Passo 1: Qual problema você está tendo?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Selecione a categoria correspondente para despacharmos o técnico habilitado.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginBottom: '32px',
            }}>
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid var(--primary-green)' : '1px solid var(--border-card)',
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: cat.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#15803d' : 'var(--primary-navy)' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ padding: '12px 24px' }}
              >
                <span>Avançar para Descrição</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROBLEM DESCRIPTION */}
        {step === 2 && (
          <div className="card" style={{ padding: '32px 24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Passo 2: Descreva o que está acontecendo
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Dê detalhes sobre o defeito para que o profissional leve as ferramentas e peças corretas.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Descrição detalhada do problema
              </label>
              <textarea
                rows={5}
                required
                placeholder="Exemplo: O disjuntor principal está desarmando toda vez que ligamos o chuveiro no modo inverno, e percebemos um leve cheiro de queimado no quadro de força."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-card)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Nível de Urgência do Atendimento
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <button
                  type="button"
                  onClick={() => setUrgency('NORMAL')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: urgency === 'NORMAL' ? '2px solid var(--primary-green)' : '1px solid var(--border-card)',
                    backgroundColor: urgency === 'NORMAL' ? '#f0fdf4' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color={urgency === 'NORMAL' ? '#16a34a' : '#64748b'} />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: urgency === 'NORMAL' ? '#15803d' : 'var(--primary-navy)' }}>
                        Normal / Padrão
                      </span>
                    </div>
                    <span className="badge badge-green">Até 24h</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Atendimento programado durante o horário comercial.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('URGENTE')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: urgency === 'URGENTE' ? '2px solid #dc2626' : '1px solid var(--border-card)',
                    backgroundColor: urgency === 'URGENTE' ? '#fef2f2' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color={urgency === 'URGENTE' ? '#dc2626' : '#64748b'} />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: urgency === 'URGENTE' ? '#b91c1c' : 'var(--primary-navy)' }}>
                        Emergência 24h
                      </span>
                    </div>
                    <span className="badge badge-red">Prioritário &lt; 2h</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Vazamentos graves, perda de chave ou pane geral de energia.
                  </p>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-outline"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!description.trim()) {
                    setErrorNotice('Preencha a descrição do problema antes de continuar.');
                    return;
                  }
                  setErrorNotice('');
                  setStep(3);
                }}
                className="btn btn-primary"
              >
                <span>Avançar para Fotos/Vídeos</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PHOTOS / VIDEOS */}
        {step === 3 && (
          <div className="card" style={{ padding: '32px 24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Passo 3: Enviar fotos ou vídeos do local
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Imagens ajudam o técnico a entender o defeito antes mesmo de chegar.
            </p>

            <div style={{
              border: '2px dashed var(--border-card)',
              borderRadius: '16px',
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              marginBottom: '24px',
            }}>
              <Camera size={40} color="var(--primary-green)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>
                Tirar foto com a câmera ou anexar da galeria
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Formatos permitidos: JPG, PNG, WEBP (até 25MB)
              </p>

              <label className="btn btn-navy btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                <Upload size={16} />
                <span>Adicionar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {photos.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Fotos anexadas ({photos.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                    {photos.map((p, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-card)', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                        <img src={p} alt={`Prévia ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          title="Remover foto"
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.75)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-outline"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn btn-primary"
              >
                <span>Avançar para Endereço</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ADDRESS CONFIRMATION */}
        {step === 4 && (
          <div className="card" style={{ padding: '32px 24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Passo 4: Confirmar endereço do atendimento
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              O profissional será despachado exatamente para este local.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      CEP
                    </label>
                    {loadingCep && (
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Buscando...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={zipCode}
                    onChange={(e) => handleZipChange(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Rua / Avenida
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Número
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn btn-outline"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="btn btn-primary"
              >
                <span>Revisar e Enviar</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL REVIEW & SUBMIT */}
        {step === 5 && (
          <div className="card" style={{ padding: '32px 24px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              Passo 5: Confirmação e Envio do Chamado
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Verifique os detalhes antes de registrar a solicitação.
            </p>

            <div style={{
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#f8fafc',
              marginBottom: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Serviço:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{selectedServiceName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Endereço:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
                  {street}, {number} - {neighborhood}, {city}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Urgência:</span>
                <span style={{ fontWeight: 600, color: urgency === 'URGENTE' ? '#dc2626' : '#16a34a' }}>
                  {urgency === 'URGENTE' ? 'Emergência (Imediato)' : 'Normal'}
                </span>
              </div>
              <div style={{ paddingTop: '4px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Problema relatado:
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{description}"
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn btn-outline"
                disabled={loading}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                {loading ? 'Registrando Chamado...' : 'Confirmar e Abrir Chamado'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
