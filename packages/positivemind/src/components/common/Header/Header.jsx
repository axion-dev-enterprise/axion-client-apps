import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '@/assets/images/logo-positivemind.jpg'
import { whatsappLink, whatsappMensagemPadrao } from '@/data/empresa'
import styles from './Header.module.css'

const navLinksMain = [
  { to: '/',                label: 'Home',           end: true },
  { to: '/servicos',        label: 'Serviços' },
  { to: '/infraestrutura',  label: 'Infraestrutura' },
  { to: '/clientes',        label: 'Clientes' },
  { to: '/galeria',         label: 'Galeria' },
]

const navLinksContact = [
  { to: '/mauro-gambini',   label: 'Mauro Gambini' },
  { to: '/hipnoterapia',    label: 'Hipnoterapia' },
  { to: '/contato',         label: 'Contato' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const prevScrollY = React.useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y > 80) {
        setHidden(y > prevScrollY.current)
      } else {
        setHidden(false)
      }
      prevScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${!menuOpen && hidden ? styles.hidden : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Positive Mind — A Team Building Company" />
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinksMain.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <span className={styles.separator}>|</span>
          {navLinksContact.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <a
            href={whatsappLink(whatsappMensagemPadrao)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
            onClick={() => setMenuOpen(false)}
          >
            Fale Conosco
          </a>
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
        </button>
      </div>
    </header>
  )
}
