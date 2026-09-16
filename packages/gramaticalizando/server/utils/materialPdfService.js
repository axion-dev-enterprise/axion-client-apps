// Material PDF Document Generator for Gramaticalizando (ISO 32000-1 Compliant)
// Generates valid, multi-page PDFs with typography, tables, and Profª Wilma pedagogical content

function escapePdfText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\u0080-\uFFFF]/g, function (match) {
      const map = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'é': 'e', 'ê': 'e',
        'í': 'i', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ú': 'u', 'ç': 'c',
        'Á': 'A', 'À': 'A', 'Ã': 'A', 'Â': 'A', 'É': 'E', 'Ê': 'E',
        'Í': 'I', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ú': 'U', 'Ç': 'C',
        '—': '-', '–': '-', '“': '"', '”': '"', '’': "'", '•': '*', '°': 'o', 'ª': 'a'
      };
      return map[match] || '';
    });
}

function buildPdf(title, subtitle, pagesContent) {
  const fontObj = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  const fontBoldObj = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  const pageObjIds = [];
  const contentObjIds = [];

  pagesContent.forEach((p, pageIdx) => {
    let stream = '';

    // Header Topbar (Deep Purple Gradient Accent)
    stream += 'q 0.42 0.13 0.66 rg 0 780 595.28 62 re f Q\n'; // Purple bar
    stream += 'q 0.55 0.2 0.85 rg 0 776 595.28 4 re f Q\n'; // Accent line

    // Header Platform Title
    stream += 'BT\n';
    stream += '/F2 13 Tf\n';
    stream += '1 1 1 rg\n';
    stream += '40 814 Td\n';
    stream += '(GRAMATICALIZANDO - LINGUA PORTUGUESA) Tj\n';
    stream += 'ET\n';

    stream += 'BT\n';
    stream += '/F1 9 Tf\n';
    stream += '0.92 0.88 1 rg\n';
    stream += '40 796 Td\n';
    stream += '(Professora Wilma Barbosa | Material Oficial de Estudos e Nivelamento) Tj\n';
    stream += 'ET\n';

    let y = 735;
    if (pageIdx === 0) {
      // Document Main Title on Page 1
      stream += 'BT\n';
      stream += '/F2 18 Tf\n';
      stream += '0.08 0.12 0.22 rg\n';
      stream += `40 ${y} Td\n`;
      stream += `(${escapePdfText(title)}) Tj\n`;
      stream += 'ET\n';
      y -= 22;

      stream += 'BT\n';
      stream += '/F1 10.5 Tf\n';
      stream += '0.3 0.35 0.45 rg\n';
      stream += `40 ${y} Td\n`;
      stream += `(${escapePdfText(subtitle)}) Tj\n`;
      stream += 'ET\n';
      y -= 26;

      // Subtle horizontal divider
      stream += `q 0.85 0.88 0.93 rg 40 ${y + 8} 515 1 re f Q\n`;
      y -= 8;
    }

    // Sections
    (p.sections || []).forEach(sec => {
      if (y < 120) return;

      // Section Title
      stream += 'BT\n';
      stream += '/F2 12 Tf\n';
      stream += '0.35 0.1 0.55 rg\n';
      stream += `40 ${y} Td\n`;
      stream += `(${escapePdfText(sec.titulo)}) Tj\n`;
      stream += 'ET\n';
      y -= 18;

      // Section Lines
      (sec.linhas || []).forEach(l => {
        if (y < 70) return;
        stream += 'BT\n';
        stream += '/F1 9.5 Tf\n';
        stream += '0.12 0.15 0.2 rg\n';
        stream += `40 ${y} Td\n`;
        stream += `(${escapePdfText(l)}) Tj\n`;
        stream += 'ET\n';
        y -= 14;
      });

      // Highlight / Tip Box
      if (sec.dica && y >= 100) {
        y -= 4;
        stream += `q 0.96 0.94 1 rg 40 ${y - 28} 515 34 re f Q\n`;
        stream += `q 0.42 0.13 0.66 rg 40 ${y - 28} 4 34 re f Q\n`;
        stream += 'BT\n';
        stream += '/F2 8.5 Tf\n';
        stream += '0.42 0.13 0.66 rg\n';
        stream += `52 ${y - 8} Td\n`;
        stream += '(DICA DE PROVA DA PROFESSORA WILMA:) Tj\n';
        stream += 'ET\n';
        stream += 'BT\n';
        stream += '/F1 9 Tf\n';
        stream += '0.15 0.2 0.3 rg\n';
        stream += `52 ${y - 21} Td\n`;
        stream += `(${escapePdfText(sec.dica)}) Tj\n`;
        stream += 'ET\n';
        y -= 40;
      }
      y -= 8;
    });

    // Footer
    stream += 'q 0.85 0.88 0.93 rg 40 50 515 1 re f Q\n';
    stream += 'BT\n';
    stream += '/F1 8.5 Tf\n';
    stream += '0.5 0.55 0.65 rg\n';
    stream += '40 34 Td\n';
    stream += '(Gramaticalizando - Plataforma Oficial de Aprendizagem. Uso exclusivo do aluno matriculado.) Tj\n';
    stream += 'ET\n';

    stream += 'BT\n';
    stream += '/F2 8.5 Tf\n';
    stream += '0.42 0.13 0.66 rg\n';
    stream += `505 34 Td\n`;
    stream += `(Pagina ${pageIdx + 1} de ${pagesContent.length}) Tj\n`;
    stream += 'ET\n';

    const streamLen = Buffer.byteLength(stream, 'latin1');
    const contentObj = `<< /Length ${streamLen} >>\nstream\n${stream}endstream`;
    contentObjIds.push(contentObj);
  });

  const allObjects = [];
  allObjects[0] = '<< /Type /Catalog /Pages 2 0 R >>';
  allObjects[2] = fontObj;
  allObjects[3] = fontBoldObj;

  let nextId = 5;
  const pageRefs = [];
  pagesContent.forEach(() => {
    const pageId = nextId++;
    const contentId = nextId++;
    pageObjIds.push({ pageId, contentId });
    pageRefs.push(`${pageId} 0 R`);
  });

  allObjects[1] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pagesContent.length} >>`;

  pageObjIds.forEach((p, i) => {
    allObjects[p.pageId - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents ${p.contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`;
    allObjects[p.contentId - 1] = contentObjIds[i];
  });

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  allObjects.forEach((obj, idx) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${allObjects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.forEach(off => {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  });

  pdf += `trailer\n<< /Size ${allObjects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

// Pre-defined pedagogical materials content
const CONTEUDO_MATERIAIS = {
  'mat-apoio-1': {
    title: 'Manual Completo de Fonetica e Fonologia',
    subtitle: 'Tabelas mnemonicas de encontros vocalicos, consonantais e separacao silabica rigorosa.',
    pages: [
      {
        sections: [
          {
            titulo: '1. Diferenca Essencial: Letra vs Fonema',
            linhas: [
              '• Letra: E o simbolo grafico, a representacao visual que escrevemos no papel ou na tela.',
              '• Fonema: E a menor unidade sonora distintiva da lingua falada.',
              '• Regra de Ouro: Uma palavra pode ter mais letras que fonemas ou mais fonemas que letras.',
              '  - Exemplo 1: HOJE -> 4 letras, 3 fonemas (H inicial e mudo).',
              '  - Exemplo 2: TAXI -> 4 letras, 5 fonemas (a letra X soa como /ks/).',
              '  - Exemplo 3: GUERRA -> 6 letras, 4 fonemas (GU e RR sao digrafos).'
            ],
            dica: 'Bancas como Vunesp e FGV adoram cobrar a contagem de fonemas em palavras com digrafos e ditsonancias.'
          },
          {
            titulo: '2. Encontros Vocalicos: Classificacao Precisa',
            linhas: [
              '• Ditongo Crescente: Semivogal + Vogal na mesma silaba (ex: his-to-ria, qua-se, se-rie).',
              '• Ditongo Decrescente: Vogal + Semivogal na mesma silaba (ex: pai, noi-te, cha-peu).',
              '• Tritongo: Semivogal + Vogal + Semivogal (ex: Pa-ra-guai, u-ru-guai, sa-guo).',
              '• Hiato: Encontro de duas vogais pronunciadas em silabas distintas (ex: sa-u-de, pa-is, sa-i-da).'
            ],
            dica: 'Lembre-se: em lingua portuguesa nunca existem duas vogais verdadeiras na mesma silaba! Uma sempre sera semivogal.'
          }
        ]
      },
      {
        sections: [
          {
            titulo: '3. Digrafos Consonantais e Digrafos Vocalicos',
            linhas: [
              '• Digrafo Consonantico: Duas letras representando um unico som consonantal.',
              '  Inseparaveis: CH (cha), LH (filho), NH (ninho), GU (guia), QU (queijo).',
              '  Separaveis: RR (car-ro), SS (pas-so), SC (nas-cer), SC (des-ca), XC (ex-ce-to).',
              '• Digrafos Vocalicos: Vogal seguida de M ou N na mesma silaba (indicando nasalizacao).',
              '  Exemplos: campo (/k p/), vento (/v t/), lindo (/l d/), ponte (/p t/), fundo (/f d/).'
            ],
            dica: 'Palavras como "canto" possuem 5 letras e apenas 4 fonemas, pois "an" e um digrafo vocalico nasal.'
          },
          {
            titulo: '4. Regras Fundamentais de Divisao Silabica',
            linhas: [
              '• Nunca se separam: ditongos, tritongos e os digrafos CH, LH, NH, GU, QU.',
              '• Devem ser separados: hiatos (sa-i-da) e os digrafos RR, SS, SC, SC, XC (car-ro, pas-so).',
              '• Encontros consonantais no inicio de palavras permanecem na primeira silaba (psi-co-lo-go, pneu-mo-ni-a).'
            ],
            dica: 'Na translineacao (fim de linha), nunca deixe uma unica vogal isolada no final ou no inicio da linha.'
          }
        ]
      }
    ]
  },
  'mat-apoio-2': {
    title: 'Guia Definitivo do Novo Acordo Ortografico',
    subtitle: 'Regras praticas do hifen, acentuacao diferencial, paroxitonas e palavras compostas.',
    pages: [
      {
        sections: [
          {
            titulo: '1. O que Mudou na Acentuacao Grafica',
            linhas: [
              '• Queda do Acento nos Ditongos Abertos EI e OI nas Paroxitonas:',
              '  Antes: ideia, assembleia, boia, jiboia, heroico, plateia (eram acentuadas).',
              '  Agora: ideia, assembleia, boia, jiboia, heroico, plateia (sem acento algum!).',
              '  ATENCAO: As oxitonas e monossilabos continuam acentuados! Ex: heroi, papeis, trofeu, doi.',
              '• Fim do Acento nos Hiatos OO e EE:',
              '  Antes: voo, enjoo, creem, deem, leem, veem.',
              '  Agora: voo, enjoo, creem, deem, leem, veem (todas sem acento).'
            ],
            dica: 'Guarde o macete: Paroxitona perdeu (ideia), mas Oxitona manteve o chapeu (heroi, chapeu).'
          },
          {
            titulo: '2. Acento Diferencial: O que Ficou e o que Caiu',
            linhas: [
              '• PERMANECEM OBRIGATORIOS:',
              '  - Pode (passado) vs Pode (presente).',
              '  - Por (verbo) vs Por (preposicao).',
              '  - Tem / Vem (singular) vs Teem / Veem (plural com acento circunflexo).',
              '• CAIRAM COMPLETAMENTE:',
              '  - Para (verbo parar) nao tem mais acento. Escreve-se "para" em todos os casos.',
              '  - Pelo (substantivo) e Polo (substantivo) perderam o acento circunflexo.'
            ],
            dica: 'O acento em "forma / forma" e FACULTATIVO. Usar "forma" (molde) com acento e permitido para evitar ambiguidade.'
          }
        ]
      },
      {
        sections: [
          {
            titulo: '3. A Regra de Ouro do Hifen com Prefixos',
            linhas: [
              '• Regra 1: "Os opostos se atraem, os iguais se repelem":',
              '  - Letras diferentes -> JUNTA sem hifen: autoescola, infraestrutura, semicirculo.',
              '  - Letras iguais -> SEPARA com hifen: micro-ondas, anti-inflamatorio, contra-ataque.',
              '• Regra 2: Prefixo terminado em vogal + palavra iniciada por R ou S -> DOBRA a consoante:',
              '  - Exemplos: antissocial, minissaia, ultrassom, antirreflexo, microssistema.',
              '• Regra 3: Diante de letra H, SEMPRE usa hifen:',
              '  - Exemplos: anti-higienico, super-homem, sobre-humano, contra-harmonia.'
            ],
            dica: 'Os prefixos SUB e SOB usam hifen diante de B, R ou H: sub-base, sub-regiao, sub-humano.'
          }
        ]
      }
    ]
  },
  'mat-apoio-3': {
    title: 'Mapa Mental - Sintaxe do Periodo Composto',
    subtitle: 'Esquema visual categorizado de oracoes coordenadas e subordinadas.',
    pages: [
      {
        sections: [
          {
            titulo: '1. Oracoes Coordenadas (Independentes Sintaticamente)',
            linhas: [
              '• Assindeticas: Nao possuem conjuncao. Ligadas por virgula ou ponto e virgula (Vim, vi, venci).',
              '• Sindeticas Aditivas: e, nem, nao so... mas tambem (Estudou e foi aprovado).',
              '• Sindeticas Adversativas: mas, porem, contudo, todavia, entretanto (Estudou, mas nao passou).',
              '• Sindeticas Alternativas: ou... ou, ora... ora, quer... quer (Ou estude, ou trabalhe).',
              '• Sindeticas Conclusivas: portanto, logo, por conseguinte, por isso (Estudou muito; passou, pois).',
              '• Sindeticas Explicativas: que, porque, pois (antes do verbo), porquanto (Entre, que esta frio).'
            ],
            dica: 'O "pois" apos o verbo e CONCLUSIVO ("Passou; merece, pois, elogios"). Antes do verbo e EXPLICATIVO ("Nao saia, pois vai chover").'
          },
          {
            titulo: '2. Oracoes Subordinadas Substantivas (Funcao de Termo da Oracao)',
            linhas: [
              '• Dica Suprema: Toda oracao substantiva pode ser substituida mentalmente por "ISSO".',
              '  Exemplo: "Quero [que voce venha]" -> "Quero [ISSO]" -> Oracao Subordinada Substantiva Objetiva Direta.',
              '• Subjetiva: Funciona como Sujeito ("E necessario [que voce estude]").',
              '• Objetiva Direta: Complementa verbo transitivo direto sem preposicao ("Ele disse [que viria]").',
              '• Objetiva Indireta: Complementa verbo com preposicao ("Insisto [em que viaje]").',
              '• Completiva Nominal: Complementa substantivo, adjetivo ou adverbio ("Tenho certeza [de que passarei]").'
            ],
            dica: 'Para saber se e Subjetiva, procure se a oracao principal tem sujeito proprio. Se nao tiver, a oracao toda e o sujeito!'
          }
        ]
      },
      {
        sections: [
          {
            titulo: '3. Oracoes Subordinadas Adjetivas e Adverbiais',
            linhas: [
              '• Adjetivas Restritivas: Sem virgula! Restringem a um grupo especifico ("Os alunos [que estudaram] passaram").',
              '• Adjetivas Explicativas: Com virgulas! Explicam uma caracteristica universal ("Deus, [que e amor], cuida de nos").',
              '• As 9 Adverbiais (Mnemocico 6C + FTP):',
              '  - Causais: porque, visto que, ja que, como (no inicio da frase).',
              '  - Concessivas: embora, conquanto, ainda que, mesmo que, posto que.',
              '  - Condicionais: se, caso, contanto que, desde que.',
              '  - Consecutivas: tanto... que, tao... que, de forma que.',
              '  - Comparativas: mais que, menos que, como.',
              '  - Conformativas: conforme, segundo, consoante.',
              '  - Finais: a fim de que, para que.',
              '  - Temporais: quando, enquanto, logo que, assim que.',
              '  - Proporcionais: a medida que, quanto mais... mais.'
            ],
            dica: 'Cuidado com a diferenca: "A medida que" (com crase) e proporcional. "Na medida em que" (sem crase) e causal!'
          }
        ]
      }
    ]
  },
  'mat-apoio-4': {
    title: 'Checklist de Ouro para a Redacao Nota Maxima',
    subtitle: 'Os 5 criterios de avaliacao, repertorios curingas e modelo estrutural dissertativo.',
    pages: [
      {
        sections: [
          {
            titulo: '1. O Esqueleto Inabalavel do Texto Dissertativo (4 Paragrafos)',
            linhas: [
              '• Paragrafo 1 (Introducao - 6 a 8 linhas):',
              '  - Contextualizacao por repertorio sociocultural legitimo.',
              '  - Apresentacao do Tema da proposta sem truncamentos.',
              '  - Tese firme antecipando dois argumentos norteadores (Argumento A1 e Argumento A2).',
              '• Paragrafo 2 (Desenvolvimento 1 - 7 a 9 linhas):',
              '  - Topico frasal ancorando o Argumento A1.',
              '  - Repertorio de autoridade (dados, filosofo, constituicao) comprovando a tese.',
              '  - Analise critica mostrando o impacto nocivo na sociedade.',
              '• Paragrafo 3 (Desenvolvimento 2 - 7 a 9 linhas):',
              '  - Topico frasal com conectivo de adicao/contraste para o Argumento A2.',
              '  - Segundo repertorio de legitimacao (literatura, historia ou legislacao).',
              '  - Fechamento com posicionamento autoral contundente.'
            ],
            dica: 'Nunca termine um paragrafo de desenvolvimento com o repertorio. O repertorio serve de base; o fechamento DEVE ser a sua analise!'
          },
          {
            titulo: '2. Repertorios Socioculturais Curingas e Multitematicos',
            linhas: [
              '• Constituicao Cidada de 1988: Artigo 6 (direitos sociais: saude, educacao, trabalho e seguranca).',
              '• Zygmunt Bauman (Modernidade Liquida): Fragilidade das relacoes humanas e volatilidade social.',
              '• Thomas Hobbes (Leviata): O papel do Estado em assegurar a paz social e evitar a barbarie.',
              '• Gilberto Dimenstein (O Cidadao de Papel): A distancia entre as leis promulgadas e sua efetivacao real.'
            ],
            dica: 'Sempre contextualize o repertorio ao tema ("Com efeito, a dinamica observada na sociedade contemporanea ecoa a tese de...").'
          }
        ]
      },
      {
        sections: [
          {
            titulo: '3. A Proposta de Intervencao Nota 200 (Os 5 Elementos)',
            linhas: [
              '• 1. Agente: Quem vai executar? (Ministerio da Educacao, Governo Federal, Poder Legislativo).',
              '• 2. Acao: O que sera feito? (Criar programas nacionais, destinar verbas especificas).',
              '• 3. Modo / Meio: Como sera realizado? ("Por intermedio de...", "mediante a alocacao de...").',
              '• 4. Efeito / Finalidade: Para que fim? ("A fim de erradicar...", "com o fito de garantir...").',
              '• 5. Detalhamento: Explicacao detalhada de um dos 4 elementos acima (especificar acoes ou atores).'
            ],
            dica: 'Garanta conectivos interparagrafos em todos os inicios de paragrafo: "Em primeira analise", "Ademais", "Portanto".'
          }
        ]
      }
    ]
  }
};

function gerarBufferMaterial(id, materialInfo) {
  const conteudo = CONTEUDO_MATERIAIS[id];
  if (conteudo) {
    return buildPdf(conteudo.title, conteudo.subtitle, conteudo.pages);
  }

  // Fallback for dynamic materials
  const titulo = materialInfo?.titulo || 'Material de Apoio Pedagocico';
  const descricao = materialInfo?.descricao || 'Apostila de estudos elaborada pela Professora Wilma Barbosa.';
  const modulo = materialInfo?.nomeModulo || 'Lingua Portuguesa';

  return buildPdf(titulo, `Modulo: ${modulo} | Professora Wilma Barbosa`, [
    {
      sections: [
        {
          titulo: '1. Apresentacao do Conteudo',
          linhas: [
            descricao,
            'Este material foi estruturado para consolidar seus conhecimentos fundamentais.',
            'Acompanhe as videoaulas correspondentes e execute as baterias de fixacao.'
          ],
          dica: 'Revise este material com atencao antes de submeter os simulados avaliativos da plataforma.'
        },
        {
          titulo: '2. Fundamentos de Estudo da Professora Wilma',
          linhas: [
            '• Leitura analitica dos conceitos gramaticais.',
            '• Resolucao ativa de questoes de bancas examinadoras.',
            '• Mapeamento de duvidas e repeticao espacada das regras essenciais.'
          ],
          dica: 'A constancia nos estudos supera a intensidade desordenada.'
        }
      ]
    }
  ]);
}

module.exports = {
  buildPdf,
  gerarBufferMaterial,
  CONTEUDO_MATERIAIS
};
