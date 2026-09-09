'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, Plus, FileText, Wrench } from '@/components/Icons';

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação Rápida Mobile">
      <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Home size={20} />
        <span>Início</span>
      </Link>

      <Link href="/#planos" className={`mobile-nav-item ${pathname === '/planos' ? 'active' : ''}`}>
        <Award size={20} />
        <span>Planos</span>
      </Link>

      <Link href="/cliente/chamados/novo" className="mobile-nav-item highlight">
        <Plus size={24} />
        <span>Assistência</span>
      </Link>

      <Link href="/cliente" className={`mobile-nav-item ${pathname.startsWith('/cliente') && !pathname.includes('novo') ? 'active' : ''}`}>
        <FileText size={20} />
        <span>Chamados</span>
      </Link>

      <Link href="/prestador" className={`mobile-nav-item ${pathname.startsWith('/prestador') ? 'active' : ''}`}>
        <Wrench size={20} />
        <span>Prestador</span>
      </Link>
    </nav>
  );
}
