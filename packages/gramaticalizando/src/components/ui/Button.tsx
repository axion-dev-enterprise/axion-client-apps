import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-glow)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-surface-2)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-muted)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)'
        };
      case 'whatsapp':
        return {
          backgroundColor: '#25D366',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.4rem 0.85rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '0.875rem 1.75rem', fontSize: '1.0625rem', borderRadius: 'var(--radius-md)' };
      case 'md':
      default:
        return { padding: '0.625rem 1.25rem', fontSize: '0.9375rem', borderRadius: 'var(--radius-md)' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        lineHeight: 1,
        transition: 'all var(--transition-fast)',
        opacity: disabled || isLoading ? 0.65 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
          if (variant === 'ghost') e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent)';
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)';
          if (variant === 'ghost') e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && !isLoading) e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        if (!disabled && !isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Processando...</span>
        </>
      ) : (
        <>
          {icon && <span style={{ display: 'flex' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
