import { Link } from 'react-router-dom'
import logo from '@/assets/images/logo-positivemind.jpg'
import { empresa, whatsappLink, whatsappMensagemPadrao } from '@/data/empresa'
import styles from './Footer.module.css'

const navLinks = [
  { to: '/',                label: 'Home' },
  { to: '/servicos',        label: 'Serviços' },
  { to: '/infraestrutura',  label: 'Infraestrutura' },
  { to: '/clientes',        label: 'Clientes' },
  { to: '/galeria',         label: 'Galeria' },
  { to: '/mauro-gambini',   label: 'Mauro Gambini' },
  { to: '/hipnoterapia',    label: 'Hipnoterapia' },
  { to: '/contato',         label: 'Contato' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Marca */}
          <div className={styles.brand}>
            <Link to="/">
              <img src={logo} alt="Positive Mind" className={styles.logo} loading="lazy" />
            </Link>
            <p className={styles.slogan}>{empresa.slogan}</p>
            <p className={styles.desc}>
              Transformamos equipes em times de alta performance há {empresa.numeros.anos} de experiência.
            </p>
            <div className={styles.socials}>
              <a
                href={empresa.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Positive Mind"
                className={styles.socialLink}
              >
                Instagram
              </a>
              <a
                href={empresa.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Mauro Gambini"
                className={styles.socialLink}
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className={styles.nav}>
            <h3 className={styles.colTitle}>Navegação</h3>
            <ul className={styles.navList}>
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={styles.navLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className={styles.contact}>
            <h3 className={styles.colTitle}>Contato</h3>
            <ul className={styles.contactList}>
              <li>
                <a
                  href={whatsappLink(whatsappMensagemPadrao)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  WhatsApp: {empresa.whatsappFormatado}
                </a>
              </li>
              <li>
                <a href={`mailto:${empresa.email}`} className={styles.contactLink}>
                  {empresa.email}
                </a>
              </li>
              <li className={styles.address}>{empresa.endereco}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>
            {empresa.razaoSocial || empresa.nome} · CNPJ {empresa.cnpj}
          </p>
          <p className={styles.copy}>
            © {year} Positive Mind. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
