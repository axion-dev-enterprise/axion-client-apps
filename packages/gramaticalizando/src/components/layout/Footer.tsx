import React from 'react';
import { BookOpen, ShieldCheck, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#070709',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '4rem',
        paddingBottom: '3rem',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Coluna 1: Sobre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={16} color="#fff" />
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                Gramaticalizando
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Plataforma digital definitiva para o domínio prático da Língua Portuguesa, gramática normativa, análise sintática e redação de alta performance para concursos e vestibulares.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>Ambiente seguro e verificado AXION</span>
            </div>
          </div>

          {/* Coluna 2: Conteúdo Programático */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Conteúdo
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li>Fonética e Fonologia</li>
              <li>Ortografia e Acentuação</li>
              <li>Morfologia & 10 Classes</li>
              <li>Sintaxe Oracional & Crase</li>
              <li>Pontuação e Estilística</li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Atendimento & Matrículas
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--accent-hover)" />
                <span>WhatsApp: (21) 99201-3060</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--accent-hover)" />
                <span>suporte@gramaticalizando.com.br</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Atendimento de segunda a sexta, das 08h às 20h.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)'
          }}
        >
          <p>© 2026 Gramaticalizando. Todos os direitos reservados.</p>
          <p>Desenvolvido sob o ecossistema AXION Enterprise.</p>
        </div>
      </div>
    </footer>
  );
};
