export const empresa = {
  nome: 'Positive Mind',
  slogan: 'A Team Building Company',
  cnpj: '57.025.894/0001-91',
  razaoSocial: null, // CONFIRMAR COM CLIENTE
  fundador: 'Mauro Gambini',
  whatsapp: '5511947265463',
  whatsappFormatado: '(11) 94726-5463',
  email: 'maurogambini@positivemind.com.br',
  endereco: 'Rua Guaranésia, 1070 — São Paulo/SP',
  instagram: 'https://instagram.com/positivemindtreinamentos',
  youtube: 'https://youtube.com/@CEOMauroGambini',
  numeros: {
    empresas: '+170',
    profissionais: '4.000+',
    anos: '13+',
  },
}

export const whatsappLink = (mensagem = '') => {
  const base = `https://wa.me/${empresa.whatsapp}`
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base
}

export const whatsappMensagemPadrao =
  'Olá! Vim pelo site da Positive Mind e gostaria de saber mais sobre os treinamentos.'
