import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  style,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: error ? 'var(--danger)' : 'var(--text-secondary)'
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '0.875rem',
              color: 'var(--text-muted)',
              display: 'flex',
              pointerEvents: 'none'
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: icon ? '0.625rem 0.875rem 0.625rem 2.5rem' : '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            backgroundColor: 'var(--bg-surface-2)',
            color: 'var(--text-primary)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            ...style
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'var(--danger-bg)' : 'var(--accent-glow)'}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error ? (
        <span style={{ fontSize: '0.8125rem', color: 'var(--danger)', marginTop: '0.125rem' }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
