const P = '/photos/logos-clientes/'

export const clientesDetalhados = [
  // Tech & Software
  { nome: 'Google',        setor: 'tecnologia', logo: P + 'google.png' },
  { nome: 'CI&T',          setor: 'tecnologia', logo: P + 'ci&t.png' },
  { nome: 'TOPdesk',       setor: 'tecnologia', logo: P + 'topdesk.png' },
  { nome: 'FICO',          setor: 'tecnologia', logo: P + 'fico.png' },
  { nome: 'LSEG',          setor: 'tecnologia', logo: P + 'lseg.png' },
  { nome: 'Flwow',         setor: 'tecnologia', logo: P + 'flwow.jfif' },
  // Indústria & Manufatura
  { nome: 'Yamaha',        setor: 'industria',  logo: P + 'yamaha-logo-png_seeklogo-154895.png' },
  { nome: 'Scania',        setor: 'industria',  logo: P + 'scania-1-logo-png-transparent.webp' },
  { nome: 'Syngenta',      setor: 'industria',  logo: P + 'syngenta-produtos.jpg' },
  { nome: 'Schneider Electric', setor: 'industria', logo: P + 'Schneider_Electric-Logo.wine.png' },
  { nome: 'SKF',           setor: 'industria',  logo: P + 'skf.jpg' },
  { nome: 'Magna',         setor: 'industria',  logo: P + 'magna.png' },
  { nome: 'Waelzholz',    setor: 'industria',  logo: P + 'logo-waelzholz-brasmetal.jpg' },
  { nome: 'Heidelberg',    setor: 'industria',  logo: P + 'heidelberg.png' },
  { nome: 'Premier Tech',  setor: 'industria',  logo: P + 'premier-tech.png' },
  { nome: 'Henry Peças',   setor: 'industria',  logo: P + 'henry-pecas.jfif' },
  { nome: 'Bunzl',         setor: 'industria',  logo: P + 'cropped-logo-Bunzl-Brasil.png' },
  // Consumo & Varejo
  { nome: 'Danone',        setor: 'consumo',    logo: P + 'danone.jpg' },
  { nome: 'Asics',         setor: 'consumo',    logo: P + 'asics.png' },
  { nome: 'Dia%',          setor: 'consumo',    logo: P + 'logo-dia-4096.png' },
  { nome: 'Authentic Feet',setor: 'consumo',    logo: P + 'authentic_feet.jpg' },
  { nome: 'EMS',           setor: 'consumo',    logo: P + 'ems.png' },
  // Financeiro & Seguros
  { nome: 'Mastercard',    setor: 'financeiro', logo: P + 'Mastercard-logo.png' },
  { nome: 'Porto Seguro',  setor: 'financeiro', logo: P + 'porto-seguro-vector-logo.png' },
  { nome: 'Ituran',        setor: 'financeiro', logo: P + 'logo-ituran-4096.png' },
  { nome: 'Clube Esperia', setor: 'esporte',    logo: P + 'clube esperia.jfif' },
  { nome: 'Fraga',         setor: 'financeiro', logo: P + 'fraga.png' },
  // Serviços & Outros
  { nome: 'Globo',         setor: 'servicos',   logo: P + 'globo-logo-png_seeklogo-398350.png' },
  { nome: '99',            setor: 'servicos',   logo: P + '99-food-logo-10.png' },
  { nome: 'OAB São Paulo', setor: 'servicos',   logo: P + 'logo oab sao paulo.png' },
  { nome: 'Mercado Livre', setor: 'servicos',   logo: P + 'mercado-livre-logo.jpg' },
  { nome: 'Voxline',       setor: 'servicos',   logo: P + 'voxline.png' },
  { nome: 'Strategicos Group', setor: 'servicos', logo: P + 'logo-strategicos.png' },
  { nome: 'Almenat',       setor: 'servicos',   logo: P + 'almenat.jfif' },
  { nome: 'Solvì Essencia Ambiental', setor: 'servicos', logo: P + 'solci-abiental.png' },
  { nome: 'OTCA',          setor: 'servicos',   logo: P + 'otca.jfif' },
  { nome: 'Céu de Prata',  setor: 'servicos',   logo: P + 'ceudeprata.png' },
  { nome: 'Trilha Carreira Interativa', setor: 'servicos', logo: P + 'trilha carreira.png' },
  // Esporte
  { nome: 'E.C. Pinheiros',setor: 'esporte',    logo: P + 'logo-pinheiros.jpg' },
]

export const setores = [
  { id: 'todos',      label: 'Todos',                cor: null },
  { id: 'tecnologia', label: 'Tecnologia',            cor: '#3B82F6' },
  { id: 'industria',  label: 'Indústria & Manufatura',cor: '#8B5CF6' },
  { id: 'consumo',    label: 'Consumo & Varejo',      cor: '#10B981' },
  { id: 'financeiro', label: 'Financeiro & Seguros',  cor: '#F59E0B' },
  { id: 'servicos',   label: 'Serviços',              cor: '#EC4899' },
  { id: 'esporte',    label: 'Esporte',               cor: '#F5A623' },
]
