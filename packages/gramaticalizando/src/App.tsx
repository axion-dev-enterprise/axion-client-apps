import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  useEffect(() => {
    // Redireciona imediatamente qualquer acesso efêmero na Vercel para o domínio oficial de produção na VPS com banco PostgreSQL
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      const canonicalHost = 'https://gramaticalizando.axionenterprise.cloud';
      window.location.replace(`${canonicalHost}${window.location.pathname}${window.location.search}${window.location.hash}`);
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
