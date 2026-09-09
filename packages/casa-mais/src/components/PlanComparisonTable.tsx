import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from '@/components/Icons';

export default function PlanComparisonTable() {
  const features = [
    { name: 'Chaveiro Residencial (aberturas e fechaduras)', essencial: 'Até 2x / ano', familia: 'Até 4x / ano', premium: 'Ilimitado*' },
    { name: 'Encanador (vazamentos, registros, canos)', essencial: 'Até 3x / ano', familia: 'Até 6x / ano', premium: 'Ilimitado*' },
    { name: 'Eletricista (disjuntores, chuveiros, fiação)', essencial: 'Até 3x / ano', familia: 'Até 6x / ano', premium: 'Ilimitado*' },
    { name: 'Pequenos Reparos (suportes, prateleiras, fixações)', essencial: 'Até 2x / ano', familia: 'Até 4x / ano', premium: 'Até 6x / ano' },
    { name: 'Dedetização Geral de Pragas Urbanas', essencial: null, familia: '1x ao ano', premium: '2x ao ano' },
    { name: 'Limpeza e Higienização de Caixa d’Água', essencial: null, familia: '1x ao ano', premium: '1x ao ano' },
    { name: 'Manutenção de Eletrodomésticos (Linha Branca)', essencial: null, familia: null, premium: 'Até 3x / ano' },
    { name: 'Check-up Preventivo Elétrico & Hidráulico', essencial: null, familia: '1x ao ano', premium: '2x ao ano' },
    { name: 'Tempo de Chegada Médio (SLA Emergencial)', essencial: 'Até 24h', familia: 'Até 4h', premium: 'Até 2h (Imediato)' },
  ];

  return (
    <div style={{ marginTop: '50px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
          Comparativo Completo de Coberturas
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Veja com clareza o que cada plano oferece para a segurança e tranquilidade do seu lar.
        </p>
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
        <table style={{
          width: '100%',
          minWidth: '680px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid var(--border-card)',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '18px 20px', textAlign: 'left', fontSize: '0.95rem', color: 'var(--primary-navy)', borderBottom: '1px solid #e2e8f0', width: '38%' }}>
                Serviços & Benefícios
              </th>
              <th style={{ padding: '18px 16px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--primary-navy)', borderBottom: '1px solid #e2e8f0', width: '20%' }}>
                <div style={{ fontWeight: 800 }}>Essencial</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>R$ 29,90/mês</div>
              </th>
              <th style={{ padding: '18px 16px', textAlign: 'center', fontSize: '0.95rem', color: '#15803d', backgroundColor: '#f0fdf4', borderBottom: '1px solid #bbf7d0', width: '22%' }}>
                <div style={{ fontWeight: 800 }}>Família</div>
                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>R$ 49,90/mês (Mais Popular)</div>
              </th>
              <th style={{ padding: '18px 16px', textAlign: 'center', fontSize: '0.95rem', color: 'var(--primary-navy)', borderBottom: '1px solid #e2e8f0', width: '20%' }}>
                <div style={{ fontWeight: 800 }}>Premium</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>R$ 79,90/mês</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: idx < features.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <td style={{ padding: '14px 20px', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>
                  {item.name}
                </td>

                {/* Essencial */}
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '0.85rem', color: item.essencial ? 'var(--text-secondary)' : '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                  {item.essencial ? item.essencial : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>

                {/* Familia */}
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#15803d', backgroundColor: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                  {item.familia ? item.familia : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>

                {/* Premium */}
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-navy)', borderBottom: '1px solid #f1f5f9' }}>
                  {item.premium ? item.premium : <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                *Uso responsável sujeito a termos de serviço
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <Link href="/checkout?plano=plano-essencial" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Escolher
                </Link>
              </td>
              <td style={{ padding: '16px', textAlign: 'center', backgroundColor: '#f0fdf4' }}>
                <Link href="/checkout?plano=plano-familia" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Escolher Família
                </Link>
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <Link href="/checkout?plano=plano-premium" className="btn btn-navy btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Escolher
                </Link>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
