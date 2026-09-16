import React, { useState } from 'react';
import { Menu, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GuiaUploadModal } from '../professor/GuiaUploadModal';

export interface ProfessorHeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export const ProfessorHeader: React.FC<ProfessorHeaderProps> = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();
  const [guiaAberto, setGuiaAberto] = useState(false);

  return (
    <header
      style={{
        height: '4rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            border: 'none',
            background: 'none'
          }}
          className="sidebar-toggle-btn"
          aria-label="Alternar Menu Lateral"
        >
          <Menu size={20} />
        </button>
        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 'clamp(140px, 35vw, 400px)'
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <Button
          variant="outline"
          size="sm"
          icon={<Sparkles size={14} />}
          onClick={() => setGuiaAberto(true)}
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--accent)',
            fontWeight: 600,
            fontSize: '0.8125rem'
          }}
        >
          Guia de Uploads
        </Button>

        <div className="header-badge-docente">
          <Badge variant="purple" size="sm">
            <ShieldCheck size={14} />
            Docente Verificado
          </Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          <span>{user?.nome?.split(' ')[0] || 'Docente'}</span>
        </div>
      </div>

      <GuiaUploadModal isOpen={guiaAberto} onClose={() => setGuiaAberto(false)} />

      <style>{`
        @media (min-width: 993px) {
          .sidebar-toggle-btn { display: none !important; }
        }
        @media (max-width: 600px) {
          .header-badge-docente { display: none !important; }
        }
      `}</style>
    </header>
  );
};
