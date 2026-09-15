import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  style,
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'purple':
        return {
          backgroundColor: 'rgba(147, 51, 234, 0.15)',
          color: '#c084fc',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        };
      case 'success':
        return {
          backgroundColor: 'var(--success-bg)',
          color: '#34d399',
          border: `1px solid var(--success-border)`
        };
      case 'warning':
        return {
          backgroundColor: 'var(--warning-bg)',
          color: '#fbbf24',
          border: `1px solid var(--warning-border)`
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger-bg)',
          color: '#f87171',
          border: `1px solid var(--danger-border)`
        };
      case 'info':
        return {
          backgroundColor: 'var(--info-bg)',
          color: '#60a5fa',
          border: `1px solid var(--info-border)`
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'var(--bg-surface-2)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)'
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.25rem 0.75rem',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        lineHeight: 1,
        ...getStyles(),
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
};
