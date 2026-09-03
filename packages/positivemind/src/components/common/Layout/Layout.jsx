import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
