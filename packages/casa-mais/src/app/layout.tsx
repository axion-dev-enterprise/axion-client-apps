import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'CASA+ — Sua casa cuidada o ano inteiro | Assistência e Manutenção Residencial',
  description: 'Precisou, chamou. A gente resolve. Plataforma por assinatura de assistência residencial com chaveiro, eletricista, encanador, pequenos reparos, dedetização e limpeza de caixa d’água.',
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0b2545',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 250px)' }}>
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
