// Helper central para disparar eventos padrão do Meta Pixel.
// Baseado em: https://eventsmanager.facebook.com/business/help/402791146561655
// O base code (fbq init) vive em index.html; aqui apenas disparamos os eventos
// nos gatilhos certos do SPA. Tudo protegido para não quebrar se o Pixel não carregou.

export function trackMeta(event, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params && Object.keys(params).length > 0) {
        window.fbq('track', event, params)
      } else {
        window.fbq('track', event)
      }
    }
  } catch (err) {
    // Falha de rastreamento nunca deve quebrar a UX.
    if (typeof console !== 'undefined') console.warn('[metaPixel] track falhou:', event, err)
  }
}

// Eventos padrão mapeados para os gatilhos do site Positive Mind.
export const MetaEvent = {
  LEAD: 'Lead',                       // envio de formulário / interesse
  COMPLETE_REGISTRATION: 'CompleteRegistration', // formulário enviado com sucesso
  CONTACT: 'Contact',                 // clique em WhatsApp / e-mail (contato direto)
  SCHEDULE: 'Schedule',               // agendamento de diagnóstico gratuito
  VIEW_CONTENT: 'ViewContent',        // visita à landing/home
}
