import { useState } from 'react'
import PageHero from '@/components/ui/PageHero/PageHero'
import CTAFinal from '@/components/sections/CTAFinal/CTAFinal'
import { empresa, whatsappLink } from '@/data/empresa'
import { trackMeta, MetaEvent } from '@/lib/metaPixel'
import styles from './Contato.module.css'

const servicos = [
  'Team Building Outdoor',
  'Team Building Indoor',
  'Programa de Liderança — Leader Coaching',
  'Palestrante Motivacional',
  'Hipnose Clínica / Esportiva',
  'Outro / Não sei ainda',
]

const participantes = [
  '10 a 30 pessoas',
  '30 a 60 pessoas',
  '60 a 100 pessoas',
  '100+ pessoas',
]

const INITIAL = { nome: '', empresa: '', email: '', telefone: '', servico: '', participantes: '', mensagem: '' }
const INITIAL_ERRORS = { nome: '', email: '', servico: '' }

function validate(form) {
  const errors = { nome: '', email: '', servico: '' }
  if (!form.nome.trim()) errors.nome = 'Nome é obrigatório.'
  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido.'
  }
  if (!form.servico) errors.servico = 'Selecione um serviço.'
  return errors
}

export default function Contato() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function maskTelefone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits.length ? `(${digits}` : ''
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  }

  function handleChange(e) {
    const { name, value } = e.target
    const parsed = name === 'telefone' ? maskTelefone(value) : value
    setForm(prev => ({ ...prev, [name]: parsed }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs)
      return
    }
    // Lead: submissão de formulário com intenção de contato (padrão Meta)
    trackMeta(MetaEvent.LEAD, { content_name: 'Formulário de Contato', content_category: 'Interesse' })
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        // CompleteRegistration: formulário enviado com sucesso
        trackMeta(MetaEvent.COMPLETE_REGISTRATION, { content_name: 'Formulário de Contato', status: 'success' })
        setStatus('success')
        setForm(INITIAL)
      } else {
        trackMeta(MetaEvent.COMPLETE_REGISTRATION, { content_name: 'Formulário de Contato', status: 'error' })
        setStatus('error')
      }
    } catch {
      trackMeta(MetaEvent.COMPLETE_REGISTRATION, { content_name: 'Formulário de Contato', status: 'error' })
      setStatus('error')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Fale com a gente"
        titulo="Vamos transformar"
        highlight="sua equipe juntos"
        sub="Preencha o formulário e entraremos em contato em até 24 horas. Ou fale direto pelo WhatsApp — é mais rápido."
      />

      <section className={styles.section}>
        <div className="container">
          <div className={styles.layout}>

            {/* ─── FORMULÁRIO ─── */}
            <div className={styles.formWrap}>
              {status === 'success' ? (
                <div className={styles.successMsg} role="alert">
                  <h2 className={styles.successTitulo}>Mensagem enviada!</h2>
                  <p className={styles.successDesc}>
                    Recebemos seu contato e retornaremos em até 24 horas.
                    Enquanto isso, se preferir falar agora pelo WhatsApp, clique abaixo.
                  </p>
                  <a
                    href={whatsappLink('Olá! Acabei de preencher o formulário do site. Podem me ajudar?')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.submitBtn}
                  >
                    Falar pelo WhatsApp agora
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="nome">
                        Nome completo <span className={styles.required} aria-hidden="true">*</span>
                      </label>
                      <input
                        id="nome"
                        name="nome"
                        type="text"
                        autoComplete="name"
                        className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                        placeholder="Seu nome"
                        value={form.nome}
                        onChange={handleChange}
                      />
                      {errors.nome && <span className={styles.fieldError}>{errors.nome}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="empresa">
                        Empresa
                      </label>
                      <input
                        id="empresa"
                        name="empresa"
                        type="text"
                        autoComplete="organization"
                        className={styles.input}
                        placeholder="Nome da sua empresa"
                        value={form.empresa}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="email">
                        E-mail <span className={styles.required} aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                      {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="telefone">
                        Telefone / WhatsApp
                      </label>
                      <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        autoComplete="tel"
                        className={styles.input}
                        placeholder="(11) 99999-9999"
                        value={form.telefone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="servico">
                        Serviço de interesse <span className={styles.required} aria-hidden="true">*</span>
                      </label>
                      <select
                        id="servico"
                        name="servico"
                        className={`${styles.select} ${errors.servico ? styles.inputError : ''}`}
                        value={form.servico}
                        onChange={handleChange}
                      >
                        <option value="">Selecione um serviço</option>
                        {servicos.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.servico && <span className={styles.fieldError}>{errors.servico}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="participantes">
                        Número de participantes
                      </label>
                      <select
                        id="participantes"
                        name="participantes"
                        className={styles.select}
                        value={form.participantes}
                        onChange={handleChange}
                      >
                        <option value="">Selecione uma faixa</option>
                        {participantes.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="mensagem">
                      Conta um pouco sobre o que você precisa
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={5}
                      className={styles.textarea}
                      placeholder="Ex: Precisamos de um team building para 40 pessoas após uma reestruturação. O objetivo é reintegrar os times..."
                      value={form.mensagem}
                      onChange={handleChange}
                    />
                  </div>

                  {status === 'error' && (
                    <p className={styles.errorMsg} role="alert">
                      Erro ao enviar. Tente novamente ou fale pelo WhatsApp.
                    </p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === 'sending'}
                    aria-busy={status === 'sending'}
                  >
                    {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
                  </button>

                  <p className={styles.privacidade}>
                    Seus dados são usados apenas para retorno de contato. Não enviamos spam.
                  </p>
                </form>
              )}
            </div>

            {/* ─── SIDEBAR INFO ─── */}
            <aside className={styles.sidebar}>
              {/* WhatsApp destaque */}
              <a
                href={whatsappLink('Olá! Vim pelo site da Positive Mind e gostaria de saber mais sobre os treinamentos.')}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappCard}
              >
                <div className={styles.whatsappIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className={styles.whatsappLabel}>Resposta mais rápida</p>
                  <p className={styles.whatsappNum}>{empresa.whatsappFormatado}</p>
                </div>
              </a>

              {/* Contatos diretos */}
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitulo}>Informações de contato</h3>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <a href={`mailto:${empresa.email}`} className={styles.infoLink}>
                      {empresa.email}
                    </a>
                  </li>
                  <li className={styles.infoItem}>
                    <span className={styles.infoText}>{empresa.endereco}</span>
                  </li>
                  <li className={styles.infoItem}>
                    <a
                      href={empresa.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoLink}
                    >
                      @positivemindtreinamentos
                    </a>
                  </li>
                  <li className={styles.infoItem}>
                    <a
                      href={empresa.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoLink}
                    >
                      youtube.com/@CEOMauroGambini
                    </a>
                  </li>
                </ul>
              </div>

              {/* Horário */}
              <div className={styles.horarioCard}>
                <p className={styles.horarioTitulo}>Atendimento</p>
                <p className={styles.horarioTexto}>Segunda a Sexta — 9h às 18h</p>
                <p className={styles.horarioTexto}>Retorno em até 24 horas úteis</p>
              </div>

              {/* Diagnóstico gratuito */}
              <div className={styles.diagCard}>
                <div>
                  <p className={styles.diagTitulo}>Diagnóstico gratuito</p>
                  <p className={styles.diagDesc}>
                    Em 30 minutos entendemos o momento da sua equipe e indicamos o melhor caminho — sem compromisso.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      <CTAFinal />
    </>
  )
}
