import { Resend } from 'resend'

const DEST_EMAIL = 'maurogambini@positivemind.com.br'
const FROM_EMAIL = 'Positive Mind Site <onboarding@resend.dev>'

// In-memory rate limit: 5 submissions per IP per hour
const rateLimitMap = new Map()
const WINDOW_MS = 60 * 60 * 1000
const MAX_REQUESTS = 5

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS }
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + WINDOW_MS
  }
  entry.count++
  rateLimitMap.set(ip, entry)
  return entry.count > MAX_REQUESTS
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente mais tarde.' })
  }

  const { nome, empresa, email, telefone, servico, participantes, mensagem } = req.body

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!nome || !email || !servico || !emailValido) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes ou inválidos' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: DEST_EMAIL,
      replyTo: email,
      subject: `[Site] Novo contato — ${esc(servico)}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Nome</td><td style="padding:8px;border:1px solid #ddd">${esc(nome)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Empresa</td><td style="padding:8px;border:1px solid #ddd">${esc(empresa) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">E-mail</td><td style="padding:8px;border:1px solid #ddd">${esc(email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Telefone</td><td style="padding:8px;border:1px solid #ddd">${esc(telefone) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Serviço</td><td style="padding:8px;border:1px solid #ddd">${esc(servico)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Participantes</td><td style="padding:8px;border:1px solid #ddd">${esc(participantes) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Mensagem</td><td style="padding:8px;border:1px solid #ddd">${esc(mensagem) || '—'}</td></tr>
        </table>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Erro ao enviar e-mail' })
  }
}
