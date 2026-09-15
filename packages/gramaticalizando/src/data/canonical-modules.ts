import { Modulo } from '../types/courses';

export const CANONICAL_MODULES: Modulo[] = [
  {
    id: 'fonetica-fonologia',
    titulo: 'Fonética e Fonologia',
    descricao: 'Estudo detalhado dos sons da fala, fonemas, divisão silábica e encontros na língua portuguesa.',
    ordem: 1,
    icone: 'Mic',
    aulas: [
      {
        id: 'divisao-silabica',
        moduloId: 'fonetica-fonologia',
        titulo: 'Divisão Silábica',
        subtitulo: 'Regras de separação de sílabas e translineação correta',
        conteudo: 'A divisão silábica no português baseia-se na soletração natural e nas regras fonéticas. Não se separam: ditongos, tritongos, dígrafos ch, lh, nh e encontros consonantais perfeitos (bl, cl, fl, pr, tr). Separam-se: hiatos, dígrafos rr, ss, sc, sç, xc e encontros consonantais imperfeitos (ad-vo-ga-do, ap-to).',
        duracao: '22 min',
        ordem: 1
      },
      {
        id: 'classificacao-fonemas',
        moduloId: 'fonetica-fonologia',
        titulo: 'Classificação dos Fonemas',
        subtitulo: 'Vogais, Semivogais e Consoantes',
        conteudo: 'Fonema é a menor unidade sonora capaz de estabelecer distinção entre palavras. Na língua portuguesa, a vogal é a base da sílaba (não há sílaba sem vogal e nunca há mais de uma vogal na mesma sílaba). As semivogais /i/ e /u/ apoiam-se na vogal para formar ditongos e tritongos.',
        duracao: '28 min',
        ordem: 2
      },
      {
        id: 'encontros-vocalicos',
        moduloId: 'fonetica-fonologia',
        titulo: 'Encontros Vocálicos',
        subtitulo: 'Ditongo, Tritongo e Hiato na prática',
        conteudo: 'Ditongo é a junção de uma vogal + semivogal (decrescente: pai, noite) ou semivogal + vogal (crescente: história, água) na mesma sílaba. Tritongo é o encontro de semivogal + vogal + semivogal (Uruguai, saguão). Hiato é o encontro de duas vogais em sílabas vizinhas (sa-ú-de, pa-ís, co-or-de-nar).',
        duracao: '30 min',
        ordem: 3
      },
      {
        id: 'encontros-consonantais',
        moduloId: 'fonetica-fonologia',
        titulo: 'Encontros Consonantais',
        subtitulo: 'Perfeitos, imperfeitos e suas particularidades',
        conteudo: 'Encontro consonantal é a sequência de duas ou mais consoantes em que cada uma mantém seu som próprio. Perfeitos ocorrem na mesma sílaba com L ou R (prato, livro, cloro). Imperfeitos ocorrem em sílabas distintas (rit-mo, dig-no, ob-je-to).',
        duracao: '20 min',
        ordem: 4
      },
      {
        id: 'digrafos',
        moduloId: 'fonetica-fonologia',
        titulo: 'Dígrafos',
        subtitulo: 'Dígrafos consonantais e vocálicos',
        conteudo: 'Dígrafo ocorre quando duas letras representam um único fonema. Consonantais: ch, lh, nh, rr, ss, sc, sç, xc, gu/qu (antes de e/i sem som de u). Vocálicos: am, em, im, om, um e an, en, in, on, un no final de sílaba (campo = /kãpu/, vento = /vẽtu/).',
        duracao: '25 min',
        ordem: 5
      }
    ]
  },
  {
    id: 'ortografia',
    titulo: 'Ortografia e Acentuação',
    descricao: 'Normas do Novo Acordo Ortográfico, regras gerais e especiais de acentuação gráfica e uso do hífen.',
    ordem: 2,
    icone: 'Edit3',
    aulas: [
      {
        id: 'regras-gerais-acentuacao',
        moduloId: 'ortografia',
        titulo: 'Regras Gerais de Acentuação',
        subtitulo: 'Oxítonas, Paroxítonas e Proparoxítonas',
        conteudo: 'Proparoxítonas: todas são acentuadas (árvore, lâmpada). Oxítonas: acentuam-se as terminadas em A, E, O (seguidos ou não de S), EM, ENS (maracujá, você, cipó, alguém, parabéns). Paroxítonas: acentuam-se as que NÃO terminam em A, E, O, EM, ENS (tórax, álbum, lápis, júri, fácil, bíceps, órgão).',
        duracao: '35 min',
        ordem: 1
      },
      {
        id: 'regras-especiais-acentuacao',
        moduloId: 'ortografia',
        titulo: 'Regras Especiais de Acentuação',
        subtitulo: 'Monossílabos, Ditongos Abertos e Hiatos',
        conteudo: 'Monossílabos tônicos: acentuam-se os terminados em A, E, O (pá, pé, pó). Hiatos em I e U: acentuam-se quando tônicos, sozinhos na sílaba ou com S, e sem NH depois (sa-í-da, ba-ú, fa-ís-ca; mas ra-i-nha, ju-iz). Ditongos abertos ÉI, ÉU, ÓI: mantêm acento nas oxítonas e monossílabos (herói, troféu, papéis), mas PERDERAM acento nas paroxítonas (ideia, jiboia, assembleia).',
        duracao: '32 min',
        ordem: 2
      },
      {
        id: 'regras-do-hifen',
        moduloId: 'ortografia',
        titulo: 'Regras do Hífen',
        subtitulo: 'O guia definitivo pós-Acordo Ortográfico',
        conteudo: 'Regra básica dos prefixos: letras iguais separam com hífen (micro-ondas, anti-inflamatório). Letras diferentes se juntam (autoescola, infraestrutura). Se o segundo elemento começa com R ou S e o prefixo termina em vogal, dobra-se a consoante (antirreflexo, ultrassom). Se o segundo elemento começa com H, sempre há hífen (super-homem, anti-higiênico).',
        duracao: '28 min',
        ordem: 3
      }
    ]
  },
  {
    id: 'semantica',
    titulo: 'Semântica e Significação das Palavras',
    descricao: 'Sentido literal e figurado, relações de significação, ambiguidade e interpretação textual profunda.',
    ordem: 3,
    icone: 'Compass',
    aulas: [
      {
        id: 'sinonimos-antonimos',
        moduloId: 'semantica',
        titulo: 'Sinônimos e Antônimos',
        subtitulo: 'Relações de semelhança e oposição vocabular',
        conteudo: 'Sinonímia é a relação de equivalência de sentido entre vocábulos em determinado contexto (alegre/contente, morrer/falecer). Antonímia é a relação de oposição de sentidos (claro/escuro, amar/odiar, progresso/retrocesso). O contexto sempre determina a precisão da equivalência.',
        duracao: '20 min',
        ordem: 1
      },
      {
        id: 'paronimos-homonimos',
        moduloId: 'semantica',
        titulo: 'Parônimos e Homônimos',
        subtitulo: 'Homógrafos, homófonos, homônimos perfeitos e parônimos',
        conteudo: 'Homônimos homófonos têm mesmo som e grafia diferente (sessão/seção/cessão, concerto/conserto). Homógrafos têm mesma grafia e som diferente (colher verbo / colher substantivo). Homônimos perfeitos têm mesmo som e grafia (manga fruta / manga de camisa). Parônimos são palavras parecidas na grafia e pronúncia, mas com sentidos distintos (eminente/iminente, flagrante/fragrante, discriminar/descriminar).',
        duracao: '30 min',
        ordem: 2
      },
      {
        id: 'polissemia',
        moduloId: 'semantica',
        titulo: 'Polissemia',
        subtitulo: 'Múltiplos sentidos da mesma palavra no contexto',
        conteudo: 'Polissemia é a propriedade de uma mesma palavra assumir múltiplos significados interligados dependendo do contexto. Exemplo: linha de costura, linha de ônibus, linha telefônica, linha de raciocínio. Diferencia-se da homonímia porque na polissemia há uma raiz de significado compartilhada.',
        duracao: '22 min',
        ordem: 3
      },
      {
        id: 'ambiguidade-anfibologia',
        moduloId: 'semantica',
        titulo: 'Ambiguidade (Anfibologia)',
        subtitulo: 'Identificação e correção do duplo sentido',
        conteudo: 'Ambiguidade ou anfibologia é o duplo sentido indesejado gerado pela má colocação de pronomes possessivos, adjuntos ou orações relativas. Exemplo: "O policial perseguiu o ladrão em seu carro" (de quem era o carro?). Como corrigir: "O policial, em seu próprio carro, perseguiu o ladrão".',
        duracao: '24 min',
        ordem: 4
      }
    ]
  },
  {
    id: 'morfologia',
    titulo: 'Morfologia — Estrutura e Formação',
    descricao: 'Elementos mórficos, radical, afixos, desinências e todos os processos de formação de novas palavras.',
    ordem: 4,
    icone: 'Layers',
    aulas: [
      {
        id: 'estrutura-das-palavras',
        moduloId: 'morfologia',
        titulo: 'Estrutura das Palavras',
        subtitulo: 'Radical, Afixos, Desinências e Vogal Temática',
        conteudo: 'Radical: morfema base que contém o significado principal. Prefixo: afixo anterior ao radical (desleal). Sufixo: afixo posterior ao radical (lealdade). Vogal temática: junta-se ao radical para receber desinências. Desinências: nominais (gênero e número) e verbais (modo-tempo e número-pessoa).',
        duracao: '26 min',
        ordem: 1
      },
      {
        id: 'processos-formacao-palavras',
        moduloId: 'morfologia',
        titulo: 'Processos de Formação de Palavras',
        subtitulo: 'Derivação e Composição',
        conteudo: 'Derivação: prefixal, sufixal, parassintética (in-feliz-mente vs en-tard-ecer), regressiva (o debate de debater) e imprópria (o olhar dos jovens). Composição: justaposição (passatempo, guarda-chuva, sem perda de fonemas) e aglutinação (planalto = plano alto, embora = em boa hora, com perda de fonemas).',
        duracao: '32 min',
        ordem: 2
      }
    ]
  },
  {
    id: 'classes-palavras',
    titulo: 'Classes de Palavras (Morfossintaxe)',
    descricao: 'As 10 classes gramaticais completas: flexões, valores sintáticos e semânticos em provas e redações.',
    ordem: 5,
    icone: 'BookOpen',
    aulas: [
      { id: 'substantivos', moduloId: 'classes-palavras', titulo: 'Substantivos', subtitulo: 'Classificação, gênero, número e grau', conteudo: 'Substantivo nomeia seres, objetos, ações, sentimentos e estados. Divide-se em comum/próprio, concreto/abstrato, simples/composto, primitivo/derivado e coletivo. Destaque para flexões especiais de plural composto e substantivos sobrecomuns, comuns de dois gêneros e epicenos.', duracao: '34 min', ordem: 1 },
      { id: 'artigos', moduloId: 'classes-palavras', titulo: 'Artigos', subtitulo: 'Definidos, indefinidos e valores discursivos', conteudo: 'Artigo acompanha o substantivo determinando-o de forma precisa (o, a, os, as) ou imprecisa (um, uma, uns, umas). Fundamental em concordância e no fenômeno da crase.', duracao: '18 min', ordem: 2 },
      { id: 'adjetivos', moduloId: 'classes-palavras', titulo: 'Adjetivos', subtitulo: 'Flexões, valor explicativo vs restritivo e locuções', conteudo: 'Adjetivo caracteriza o substantivo atribuindo-lhe estado, qualidade ou aspecto. Atenção à mudança de sentido pela posição: "pobre homem" (infeliz) vs "homem pobre" (sem recursos).', duracao: '28 min', ordem: 3 },
      { id: 'numerais', moduloId: 'classes-palavras', titulo: 'Numerais', subtitulo: 'Cardinais, ordinais, multiplicativos e fracionários', conteudo: 'Numerais quantificam seres ou posicionam-nos em ordem. Regras de concordância e leitura de leis e séculos (século XX = vinte; D. Pedro II = segundo; artigo 9.º = nono; artigo 10 = dez).', duracao: '16 min', ordem: 4 },
      { id: 'pronomes', moduloId: 'classes-palavras', titulo: 'Pronomes', subtitulo: 'Pessoais, demonstrativos, relativos, possessivos e indefinidos', conteudo: 'Pronomes substituem ou acompanham nomes. Atenção extrema ao uso anafórico/catafórico dos demonstrativos (este/esse/aquele) e ao emprego dos pronomes relativos (que, quem, cujo, onde).', duracao: '45 min', ordem: 5 },
      { id: 'verbos', moduloId: 'classes-palavras', titulo: 'Verbos (Flexão, Tempos e Modos)', subtitulo: 'Indicativo, Subjuntivo, Imperativo e vozes verbais', conteudo: 'Classe central da oração. Estudo aprofundado dos tempos e modos verbais, verbos irregulares e anômalos (haver, ter, vir, ver, pôr) e correlação verbal exigida em concursos.', duracao: '50 min', ordem: 6 },
      { id: 'adverbios', moduloId: 'classes-palavras', titulo: 'Advérbios', subtitulo: 'Circunstâncias e locuções adverbiais', conteudo: 'Palavra invariável que modifica verbo, adjetivo ou outro advérbio, indicando tempo, lugar, modo, intensidade, negação, dúvida ou afirmação.', duracao: '24 min', ordem: 7 },
      { id: 'preposicoes', moduloId: 'classes-palavras', titulo: 'Preposições', subtitulo: 'Essenciais, acidentais e regência', conteudo: 'Conecta termos estabelecendo subordinação. Preposições essenciais: a, ante, após, até, com, contra, de, desde, em, entre, para, perante, por, sem, sob, sobre, trás.', duracao: '22 min', ordem: 8 },
      { id: 'conjuncoes', moduloId: 'classes-palavras', titulo: 'Conjunções', subtitulo: 'Coordenativas e Subordinativas', conteudo: 'Conjunções ligam orações. Coordenativas: aditivas, adversativas, alternativas, conclusivas e explicativas. Subordinativas: causais, comparativas, concessivas, condicionais, conformativas, consecutivas, finais, proporcionais e temporais.', duracao: '42 min', ordem: 9 },
      { id: 'interjeicoes', moduloId: 'classes-palavras', titulo: 'Interjeições', subtitulo: 'Expressões emocionais e pontuação', conteudo: 'Palavras invariáveis que traduzem emoções, sensações e apelos instantâneos (Psiu!, Puxa!, Eia!). São sempre acompanhadas de ponto de exclamação.', duracao: '14 min', ordem: 10 }
    ]
  },
  {
    id: 'analise-sintatica',
    titulo: 'Análise Sintática e Sintaxe Oracional',
    descricao: 'Termos da oração, subordinação, coordenação, crase, concordância, regência e colocação pronominal.',
    ordem: 6,
    icone: 'GitCommit',
    aulas: [
      { id: 'termos-da-oracao', moduloId: 'analise-sintatica', titulo: 'Termos da Oração', subtitulo: 'Essenciais, Integrantes e Acessórios', conteudo: 'Essenciais: Sujeito e Predicado. Integrantes: Objeto Direto, Objeto Indireto, Complemento Nominal e Agente da Passiva. Acessórios: Adjunto Adnominal, Adjunto Adverbial, Aposto e Vocativo.', duracao: '44 min', ordem: 1 },
      { id: 'periodo-simples-composto', moduloId: 'analise-sintatica', titulo: 'Período Simples e Período Composto', subtitulo: 'Estruturação sintática e contagem de orações', conteudo: 'Período simples possui apenas uma oração (oração absoluta). Período composto possui duas ou mais orações, formadas por coordenação, subordinação ou ambas.', duracao: '25 min', ordem: 2 },
      { id: 'oracoes-coordenadas', moduloId: 'analise-sintatica', titulo: 'Orações Coordenadas', subtitulo: 'Sindéticas e Assindéticas', conteudo: 'Orações sintaticamente independentes entre si. Assindéticas não possuem conectivo. Sindéticas: Aditivas, Adversativas, Alternativas, Conclusivas e Explicativas.', duracao: '30 min', ordem: 3 },
      { id: 'oracoes-subordinadas', moduloId: 'analise-sintatica', titulo: 'Orações Subordinadas', subtitulo: 'Substantivas, Adjetivas e Adverbiais', conteudo: 'Orações dependentes sintaticamente da oração principal. Substantivas exercem papel de sujeito, objeto, predicativo ou complemento nominal. Adjetivas restringem ou explicam. Adverbiais indicam circunstâncias adverbiais.', duracao: '48 min', ordem: 4 },
      { id: 'regencia-verbal-nominal', moduloId: 'analise-sintatica', titulo: 'Regência Verbal e Nominal', subtitulo: 'Relação entre termo regente e termo regido', conteudo: 'Casos clássicos de regência: assistir (ver vs ajudar), aspirar (desejar vs inalar), visar (ter por objetivo vs assinar), preferir (isto A aquilo, nunca que), esquecer/lembrar (pronominal exige DE).', duracao: '36 min', ordem: 5 },
      { id: 'crase', moduloId: 'analise-sintatica', titulo: 'Crase — Teoria e Prática Definitiva', subtitulo: 'Casos proibidos, obrigatórios e facultativos', conteudo: 'Fusão da preposição A com o artigo feminino A ou pronomes demonstrativos. Nunca ocorre: antes de masculino, verbos, pronomes pessoais e palavras repetidas. Facultativa: antes de pronome possessivo feminino singular, nomes próprios femininos e depois de "até".', duracao: '40 min', ordem: 6 },
      { id: 'concordancia-verbal-nominal', moduloId: 'analise-sintatica', titulo: 'Concordância Verbal e Nominal', subtitulo: 'Regras gerais e casos especiais', conteudo: 'Concordância verbal: verbo com sujeito. Verbo haver no sentido de existir é impessoal (Havia muitas pessoas). Partícula SE apassivadora (Vendem-se casas) vs indeterminadora do sujeito (Precisa-se de atendentes). Concordância nominal: adjetivo concorda em gênero e número.', duracao: '42 min', ordem: 7 },
      { id: 'colocacao-pronominal', moduloId: 'analise-sintatica', titulo: 'Colocação Pronominal', subtitulo: 'Próclise, Ênclise e Mesóclise', conteudo: 'Próclise (pronome antes do verbo): atrativos obrigatórios (palavras de sentido negativo, advérbios, pronomes relativos/indefinidos, orações optativas). Mesóclise: futuros do presente/pretérito sem atrativo próclise. Ênclise: início de frase, após pausa de vírgula ou gerúndio.', duracao: '32 min', ordem: 8 }
    ]
  },
  {
    id: 'pontuacao-estilistica',
    titulo: 'Pontuação e Estilística',
    descricao: 'Uso da vírgula, pontuação expressiva, figuras de linguagem e eliminação de vícios de linguagem.',
    ordem: 7,
    icone: 'Feather',
    aulas: [
      { id: 'uso-da-virgula', moduloId: 'pontuacao-estilistica', titulo: 'Uso da Vírgula', subtitulo: 'Quando usar e quando NUNCA usar a vírgula', conteudo: 'Regra de ouro: nunca separe sujeito do verbo, nem verbo dos seus complementos diretos. Uso obrigatório: isolar aposto, vocativo, adjunto adverbial deslocado, orações adjetivas explicativas, orações coordenadas assindéticas e termos enumerados.', duracao: '38 min', ordem: 1 },
      { id: 'outros-sinais-pontuacao', moduloId: 'pontuacao-estilistica', titulo: 'Ponto e Vírgula, Dois-Pontos e Travessão', subtitulo: 'Domínio dos sinais secundários de pontuação', conteudo: 'Ponto e vírgula separa itens de enumeração complexa ou orações coordenadas extensas já com vírgulas internas. Dois-pontos introduzem aposto explicativo, enumeração ou citação. Travessão enfatiza explicações e marca diálogos.', duracao: '25 min', ordem: 2 },
      { id: 'figuras-de-linguagem', moduloId: 'pontuacao-estilistica', titulo: 'Figuras de Linguagem', subtitulo: 'Metáfora, metonímia, antítese, paradoxo, hipérbole e ironia', conteudo: 'Recursos estilísticos que potencializam a expressividade: metáfora (comparação implícita), metonímia (o continente pelo conteúdo), antítese (ideias opostas), paradoxo (ideias inconciliáveis), hipérbole (exagero intencional) e eufemismo (suavização).', duracao: '30 min', ordem: 3 },
      { id: 'vicios-de-linguagem', moduloId: 'pontuacao-estilistica', titulo: 'Vícios de Linguagem', subtitulo: 'Como identificar e eliminar na redação', conteudo: 'Erros que comprometem a clareza e elegância do texto: pleonasmo vicioso (subir para cima, hemorragia de sangue), barbarismo (erro de pronúncia/grafia), solecismo (erro de sintaxe), cacofonia (som desagradável na junção de palavras) e eco (rimas indesejadas em prosa).', duracao: '26 min', ordem: 4 }
    ]
  }
];
