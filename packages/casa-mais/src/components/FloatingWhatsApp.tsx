'use client';

import React, { useState } from 'react';
import { Phone, X, Sparkles } from '@/components/Icons';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 90,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {showTooltip && (
        <div style={{
          backgroundColor: '#ffffff',
          color: 'var(--primary-navy)',
          padding: '8px 14px',
          borderRadius: '9999px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
          border: '1px solid #e2e8f0',
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 200ms ease',
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span>Plantão CASA+ Online</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              marginLeft: '4px',
            }}
            aria-label="Fechar dica"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <a
        href="https://wa.me/5563992345678?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20planos%20do%20Casa%2B"
        target="_blank"
        rel="noreferrer"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
          textDecoration: 'none',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
        }}
        aria-label="Falar pelo WhatsApp com CASA+"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}
