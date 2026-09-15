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
          backgroundColor: '#f3e8ff',
          color: '#6b21a8',
          border: '1px solid #d8b4fe'
        };
      case 'success':
        return {
          backgroundColor: '#dcfce7',
          color: '#15803d',
          border: '1px solid #bbf7d0'
        };
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          color: '#b45309',
          border: '1px solid #fde68a'
        };
      case 'danger':
        return {
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fecaca'
        };
      case 'info':
        return {
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe'
        };
      case 'neutral':
      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#475569',
          border: '1px solid #e2e8f0'
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: size === 'sm' ? '0.2rem 0.6rem' : '0.25rem 0.75rem',
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
