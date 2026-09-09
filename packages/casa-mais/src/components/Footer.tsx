import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  Droplets,
  Zap,
  Key,
  Wrench,
  Bug,
  Cpu,
} from '@/components/Icons';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-navy)',
      color: '#f8fafc',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: '60px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* Col 1: Brand & Slogan */}
          <div>
            <div style={{ position: 'relative', width: '150px', height: '60px', marginBottom: '16px', background: '#ffffff', borderRadius: '10px', padding: '4px' }}>
              <Image
                src="/logo.png"
                alt="CASA+ Assistência e Manutenção Residencial"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              <strong>Sua casa cuidada o ano inteiro.</strong><br />
              Precisou, chamou. A gente resolve. A maior rede de assistência e manutenção residencial por assinatura.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>Profissionais Checados & Qualificados</span>
            </div>
          </div>

          {/* Col 2: Serviços Cobertos */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '18px' }}>
              Serviços Cobertos
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={16} color="#38bdf8" />
                <span>Encanador & Desentupimento</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#fbbf24" />
                <span>Eletricista Residencial</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} color="#f43f5e" />
                <span>Chaveiro 24 Horas</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={16} color="#34d399" />
                <span>Pequenos Reparos & Instalações</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bug size={16} color="#fb923c" />
                <span>Dedetização & Pragas Urbanas</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#22d3ee" />
                <span>Limpeza de Caixa d’Água</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="#a5b4fc" />
                <span>Assistência a Eletrodomésticos</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Planos & Acessos */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '18px' }}>
              Planos & Portais
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <Link href="/#planos" style={{ color: '#cbd5e1' }}>Plano Essencial (R$ 29,90/mês)</Link>
              </li>
              <li>
                <Link href="/#planos" style={{ color: '#cbd5e1' }}>Plano Família (R$ 49,90/mês)</Link>
              </li>
              <li>
                <Link href="/#planos" style={{ color: '#cbd5e1' }}>Plano Premium (R$ 79,90/mês)</Link>
              </li>
              <li>
                <Link href="/cliente" style={{ color: '#22c55e', fontWeight: 600 }}>Área do Cliente (Meu Casa+)</Link>
              </li>
              <li>
                <Link href="/prestador" style={{ color: '#cbd5e1' }}>Quero ser um Prestador Parceiro</Link>
              </li>
              <li>
                <Link href="/admin" style={{ color: '#94a3b8' }}>Acesso Administrativo</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Central de Atendimento */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '18px' }}>
              Atendimento ao Cliente
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#22c55e" />
                <span>Central: (63) 3215-0000</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#22c55e" />
                <span>WhatsApp: (63) 99234-5678</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#22c55e" />
                <span>Atendimento: Palmas e Região</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                Atendimento emergencial 24h para chaveiro, vazamentos graves e panes elétricas.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#64748b',
        }}>
          <div>
            © 2026 CASA+ Assistência Residencial Ltda. CNPJ 00.000.000/0001-00. Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Termos de Uso</span>
            <span>Política de Privacidade (LGPD)</span>
            <span>Segurança da Informação</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
