import React from 'react';
import { Menu, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export interface ProfessorHeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export const ProfessorHeader: React.FC<ProfessorHeaderProps> = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: '4rem',
        backgroundColor: '#0e0e12',
        borderBottom: '1px solid var(--border-subtle)',
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
            cursor: 'pointer'
          }}
          className="sidebar-toggle-btn"
          aria-label="Alternar Menu Lateral"
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Badge variant="purple" size="sm">
          <ShieldCheck size={14} />
          Docente Verificado
        </Badge>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <span>{user?.nome || 'Docente'}</span>
        </div>
      </div>

      <style>{`
        @media (min-width: 993px) {
          .sidebar-toggle-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
