'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, ShieldCheck, Wrench, Plus, Phone } from '@/components/Icons';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-card)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '130px', height: '52px' }}>
            <Image
              src="/logo.png"
              alt="CASA+ Assistência e Manutenção Residencial"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="md-flex">
          <Link href="/#planos" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Planos
          </Link>
          <Link href="/#servicos" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Serviços
          </Link>
          <Link href="/#como-funciona" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Como Funciona
          </Link>
          <Link href="/cliente" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-navy)' }}>
            <User size={17} />
            Área do Cliente
          </Link>
          <Link href="/prestador" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Wrench size={17} />
            Sou Prestador
          </Link>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
            <ShieldCheck size={16} />
            Admin
          </Link>
        </nav>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/cliente/chamados/novo"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex' }}
          >
            <Plus size={18} />
            <span>Pedir Assistência</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--primary-navy)',
            }}
            className="md-hide"
            aria-label="Alternar Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-card)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }} className="md-hide">
          <Link
            href="/#planos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            Conhecer Planos
          </Link>
          <Link
            href="/#servicos"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            Serviços Inclusos
          </Link>
          <Link
            href="/#como-funciona"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 0' }}
          >
            Como Funciona
          </Link>
          <div style={{ height: '1px', backgroundColor: 'var(--border-card)', margin: '4px 0' }} />
          <Link
            href="/cliente"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 600, color: 'var(--primary-navy)' }}
          >
            <User size={18} />
            Área do Cliente (Meu Casa+)
          </Link>
          <Link
            href="/prestador"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}
          >
            <Wrench size={18} />
            Portal do Prestador
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}
          >
            <ShieldCheck size={18} />
            Painel Administrativo
          </Link>
        </div>
      )}
    </header>
  );
}
