import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  className = '',
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return '1rem';
      case 'lg': return '2rem';
      case 'md':
      default: return '1.5rem';
    }
  };

  const isInteractive = variant === 'interactive';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: getPadding(),
        boxShadow: variant === 'elevated' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: isInteractive ? 'transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal)' : undefined,
        cursor: isInteractive ? 'pointer' : undefined,
        ...style
      }}
      onMouseEnter={(e) => {
        if (isInteractive) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = 'var(--accent-border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-purple)';
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.boxShadow = variant === 'elevated' ? 'var(--shadow-md)' : 'var(--shadow-sm)';
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
