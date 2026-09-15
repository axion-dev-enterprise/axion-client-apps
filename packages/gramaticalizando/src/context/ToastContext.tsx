import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100vw - 3rem)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          let icon = <Info size={20} color="#3b82f6" />;
          let borderColor = 'rgba(59, 130, 246, 0.4)';
          let bgColor = '#101726';

          if (toast.type === 'success') {
            icon = <CheckCircle2 size={20} color="#10b981" />;
            borderColor = 'rgba(16, 185, 129, 0.4)';
            bgColor = '#0a2318';
          } else if (toast.type === 'error') {
            icon = <AlertCircle size={20} color="#ef4444" />;
            borderColor = 'rgba(239, 68, 68, 0.4)';
            bgColor = '#280d0d';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle size={20} color="#f59e0b" />;
            borderColor = 'rgba(245, 158, 11, 0.4)';
            bgColor = '#291c07';
          }

          return (
            <div
              key={toast.id}
              className="animate-fade-in"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.125rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                boxShadow: 'var(--shadow-lg)',
                color: '#fafafa',
                fontSize: '0.875rem',
                gap: '0.75rem',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                {icon}
                <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: 'rgba(255, 255, 255, 0.75)',
                  display: 'flex',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
                aria-label="Fechar notificação"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
