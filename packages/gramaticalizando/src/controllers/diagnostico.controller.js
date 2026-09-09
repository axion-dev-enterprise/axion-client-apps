const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

const QUESTOES_DIAGNOSTICO = [
    {
        id: "diag-interp-1",
        topico: "interpretacao",
        nomeTopico: "Interpretação de Texto",
        enunciado: "No trecho: 'A tecnologia não nos torna mais inteligentes; ela apenas amplifica nossas intenções prévias', o autor estabelece entre as orações uma relação de:",
        alternativas: [
            { id: "a", texto: "Causa e consequência." },
            { id: "b", texto: "Retificação ou contraposição com adição." },
            { id: "c", texto: "Finalidade e concessão." },
            { id: "d", texto: "Comparação de superioridade." }
        ],
        respostaCorreta: "b",
        explicacao: "O ponto e vírgula introduz uma ideia retificadora e de contraposição ('não nos torna... apenas amplifica'), delimitando o real papel da tecnologia."
    },
    {
        id: "diag-interp-2",
        topico: "interpretacao",
        nomeTopico: "Interpretação de Texto",
        enunciado: "Infere-se de um texto quando a informação:",
        alternativas: [
            { id: "a", texto: "Está expressa e literalmente escrita na superfície textual." },
            { id: "b", texto: "É deduzida logicamente a partir de pistas contextuais e pressupostos." },
            { id: "c", texto: "Contradiz a tese defendida pelo autor." },
            { id: "d", texto: "Depende exclusivamente da opinião pessoal e subjetiva do leitor." }
        ],
        respostaCorreta: "b",
        explicacao: "A inferência é a dedução lógica e contextual construída a partir de pistas deixadas pelo texto, diferente da leitura puramente literal."
    },
    {
        id: "diag-sintaxe-1",
        topico: "sintaxe",
        nomeTopico: "Análise Sintática",
        enunciado: "Em 'Necessita-se de servidores dedicados na administração pública', o termo 'de servidores dedicados' exerce a função sintática de:",
        alternativas: [
            { id: "a", texto: "Objeto direto preposicionado." },
            { id: "b", texto: "Objeto indireto." },
            { id: "c", texto: "Complemento nominal." },
            { id: "d", texto: "Agente da passiva." }
        ],
        respostaCorreta: "b",
        explicacao: "O verbo 'necessitar' é transitivo indireto (quem necessita, necessita DE algo). O 'se' é índice de indeterminação do sujeito."
    },
    {
        id: "diag-sintaxe-2",
        topico: "sintaxe",
        nomeTopico: "Análise Sintática",
        enunciado: "Assinale a alternativa em que a oração destacada é subordinada substantiva subjetiva:",
        alternativas: [
            { id: "a", texto: "Quero [que você estude com dedicação]." },
            { id: "b", texto: "É indispensável [que o candidato domine a norma-padrão]." },
            { id: "c", texto: "Tenho certeza [de que seremos aprovados]." },
            { id: "d", texto: "A verdade é [que a disciplina supera a motivação]." }
        ],
        respostaCorreta: "b",
        explicacao: "Na oração principal 'É indispensável', o verbo de ligação + predicativo exigem um sujeito, que é a oração 'que o candidato domine a norma-padrão'."
    },
    {
        id: "diag-concord-1",
        topico: "concordancia",
        nomeTopico: "Concordância Verbal e Nominal",
        enunciado: "Indique a oração que respeita rigorosamente a concordância segundo a norma-padrão:",
        alternativas: [
            { id: "a", texto: "Houveram muitos recursos contra o gabarito preliminar." },
            { id: "b", texto: "Fazem três anos que me preparo para este concurso." },
            { id: "c", texto: "Mais de um candidato contestou a questão anulada." },
            { id: "d", texto: "Alugam-se salas comerciais no centro da cidade." }
        ],
        respostaCorreta: "d",
        explicacao: "Em 'Alugam-se salas', 'salas comerciais' é sujeito paciente e 'se' é partícula apassivadora, logo o verbo pluraliza ('alugam-se'). Em 'a' e 'b', 'haver' e 'fazer' com sentido de tempo/existência são impessoais (havia/faz)."
    },
    {
        id: "diag-concord-2",
        topico: "concordancia",
        nomeTopico: "Concordância Verbal e Nominal",
        enunciado: "No que tange à concordância nominal, assinale a frase correta:",
        alternativas: [
            { id: "a", texto: "A aluna respondeu que ela mesmo redigiu o texto." },
            { id: "b", texto: "Seguem anexo as folhas de redação corrigidas." },
            { id: "c", texto: "É necessária dedicação constante para vencer a concorrência." },
            { id: "d", texto: "Eram estudantes bastante esforçadas." }
        ],
        respostaCorreta: "d",
        explicacao: "Em 'd', 'bastante' funciona como advérbio de intensidade (modifica o adjetivo 'esforçadas'), portanto é invariável."
    },
    {
        id: "diag-crase-1",
        topico: "crase",
        nomeTopico: "Emprego do Acento Indicativo de Crase",
        enunciado: "O acento grave indicador de crase está empregado corretamente em:",
        alternativas: [
            { id: "a", texto: "O diretor começou à expor as novas diretrizes pedagógicas." },
            { id: "b", texto: "Entregou a premiação à aluna mais disciplinada da turma." },
            { id: "c", texto: "Após o almoço, os professores caminharam à pé até a biblioteca." },
            { id: "d", texto: "Solicitamos orientações à Sua Excelência durante o evento." }
        ],
        respostaCorreta: "b",
        explicacao: "Quem entrega, entrega algo A alguém (preposição 'a' + artigo definido feminino 'a aluna' = 'à aluna'). Diante de verbo ('expor'), palavra masculina ('pé') e pronome de tratamento ('Sua Excelência') não ocorre crase."
    },
    {
        id: "diag-crase-2",
        topico: "crase",
        nomeTopico: "Emprego do Acento Indicativo de Crase",
        enunciado: "Assinale o caso em que o uso do acento grave é FACULTATIVO:",
        alternativas: [
            { id: "a", texto: "Enviei os relatórios à minha professora de português." },
            { id: "b", texto: "Fomos à praia de Copacabana no domingo." },
            { id: "c", texto: "A aula começará às oito horas em ponto." },
            { id: "d", texto: "Refiro-me àqueles candidatos aprovados no certame." }
        ],
        respostaCorreta: "a",
        explicacao: "Diante de pronomes possessivos femininos no singular ('minha', 'tua', 'sua'), o artigo é facultativo, tornando o uso da crase facultativo."
    },
    {
        id: "diag-pont-1",
        topico: "pontuacao",
        nomeTopico: "Pontuação e Emprego da Vírgula",
        enunciado: "Assinale a alternativa pontuada de forma INCORRETA segundo a norma-padrão:",
        alternativas: [
            { id: "a", texto: "Os estudantes dedicados, conquistaram as primeiras colocações." },
            { id: "b", texto: "Brasília, 21 de abril de 1960, nasceu sob forte expectativa." },
            { id: "c", texto: "Portanto, caros alunos, mantenham o foco nas revisões." },
            { id: "d", texto: "Quando a prova começou, o silêncio tomou conta da sala." }
        ],
        respostaCorreta: "a",
        explicacao: "É proibido separar por vírgula o sujeito direto ('Os estudantes dedicados') do seu respectivo predicado/verbo ('conquistaram')."
    },
    {
        id: "diag-pont-2",
        topico: "pontuacao",
        nomeTopico: "Pontuação e Emprego da Vírgula",
        enunciado: "Em 'O professor explicou a matéria; os alunos, atentos, faziam anotações', a vírgula entre 'atentos' tem função de isolar um:",
        alternativas: [
            { id: "a", texto: "Vocativo." },
            { id: "b", texto: "Predicativo do sujeito deslocado." },
            { id: "c", texto: "Aposto especificativo." },
            { id: "d", texto: "Adjunto adverbial de lugar." }
        ],
        respostaCorreta: "b",
        explicacao: "'Atentos' é adjetivo qualificando o sujeito 'os alunos' e intercalado entre sujeito e verbo, exercendo a função de predicativo do sujeito deslocado."
    }
];

async function obterQuestoes(req, res) {
    // Retorna as questões sem o gabarito nem explicação
    const questoesSemGabarito = QUESTOES_DIAGNOSTICO.map(q => ({
        id: q.id,
        topico: q.topico,
        nomeTopico: q.nomeTopico,
        enunciado: q.enunciado,
        alternativas: q.alternativas
    }));

    return res.json({
        sucesso: true,
        totalQuestoes: questoesSemGabarito.length,
        questoes: questoesSemGabarito
    });
}

function gerarCronogramaPersonalizado(foco, horasSemanais, lacunas) {
    const horas = Math.max(2, Math.min(30, Number(horasSemanais) || 6));
    const prioridade1 = lacunas[0] || "Análise Sintática";
    const prioridade2 = lacunas[1] || "Interpretação de Texto";

    return [
        {
            dia: "Segunda-feira",
            foco: prioridade1,
            atividades: [
                "Assistir videoaula de teoria e fundamentos",
                "Baixar e ler material de apoio (PDF)",
                "Resolver 10 questões comentadas no módulo"
            ],
            tempoEstimadoMin: Math.round((horas * 60) / 5)
        },
        {
            dia: "Terça-feira",
            foco: prioridade2,
            atividades: [
                "Estudo de regras essenciais e pegadinhas de bancas",
                "Fixação com bateria de exercícios práticos",
                "Revisão de anotações no caderno de erros"
            ],
            tempoEstimadoMin: Math.round((horas * 60) / 5)
        },
        {
            dia: "Quarta-feira",
            foco: "Redação & Estrutura Dissertativa",
            atividades: [
                "Escolha do tema semanal na plataforma",
                "Construção do esqueleto de redação (introdução + D1 + D2 + conclusão)",
                "Envio da redação para correção da Profª Wilma"
            ],
            tempoEstimadoMin: Math.round((horas * 60) / 5)
        },
        {
            dia: "Quinta-feira",
            foco: "Morfologia e Concordância",
            atividades: [
                "Revisão dos casos especiais de concordância verbal e crase",
                "Resolução de 15 questões de fixação com foco na banca"
            ],
            tempoEstimadoMin: Math.round((horas * 60) / 5)
        },
        {
            dia: "Sexta-feira / Sábado",
            foco: "Simulado & Revisão Geral",
            atividades: [
                "Simulado rápido de 15 questões abrangendo o conteúdo da semana",
                "Leitura do feedback da redação corrigida",
                "Revisão ativa dos pontos de atenção"
            ],
            tempoEstimadoMin: Math.round((horas * 60) / 5)
        }
    ];
}

async function processar(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario) {
            return res.status(401).json({ erro: "Usuário não autenticado." });
        }

        const foco = String(req.body.foco || "concursos").toLowerCase();
        const horasSemanais = Number(req.body.horasSemanais || 6);
        const respostas = req.body.respostas || [];

        // Mapear gabarito
        const mapaGabarito = new Map(QUESTOES_DIAGNOSTICO.map(q => [q.id, q]));
        const resultadosPorTopico = {
            interpretacao: { nome: "Interpretação de Texto", acertos: 0, total: 0 },
            sintaxe: { nome: "Análise Sintática", acertos: 0, total: 0 },
            concordancia: { nome: "Concordância Verbal e Nominal", acertos: 0, total: 0 },
            crase: { nome: "Crase", acertos: 0, total: 0 },
            pontuacao: { nome: "Pontuação", acertos: 0, total: 0 }
        };

        let totalAcertos = 0;
        const correcoesIndividuais = [];

        QUESTOES_DIAGNOSTICO.forEach(q => {
            const topico = resultadosPorTopico[q.topico];
            if (topico) topico.total += 1;

            const respostaDada = respostas.find(r => r.questaoId === q.id);
            const respostaValor = respostaDada ? String(respostaDada.resposta).trim().toLowerCase() : null;
            const acertou = respostaValor === q.respostaCorreta.toLowerCase();

            if (acertou) {
                totalAcertos += 1;
                if (topico) topico.acertos += 1;
            }

            correcoesIndividuais.push({
                questaoId: q.id,
                topico: q.nomeTopico,
                enunciado: q.enunciado,
                acertou,
                respostaAluno: respostaValor,
                respostaCorreta: q.respostaCorreta,
                explicacao: q.explicacao
            });
        });

        const percentualGeral = Math.round((totalAcertos / QUESTOES_DIAGNOSTICO.length) * 100);

        // Identificar lacunas (tópicos com menor percentual)
        const rankingTopicos = Object.keys(resultadosPorTopico).map(chave => {
            const item = resultadosPorTopico[chave];
            const pct = item.total > 0 ? Math.round((item.acertos / item.total) * 100) : 0;
            return {
                chave,
                nome: item.nome,
                acertos: item.acertos,
                total: item.total,
                percentual: pct
            };
        }).sort((a, b) => a.percentual - b.percentual);

        const lacunasIdentificadas = rankingTopicos
            .filter(t => t.percentual < 100)
            .map(t => t.nome);

        let nivel = "Iniciante";
        if (percentualGeral >= 80) nivel = "Avançado";
        else if (percentualGeral >= 50) nivel = "Intermediário";

        const cronogramaSemanal = gerarCronogramaPersonalizado(foco, horasSemanais, lacunasIdentificadas);

        const agora = new Date().toISOString();
        const diagnosticoSalvo = {
            dataRealizacao: agora,
            foco,
            horasSemanais,
            nivel,
            percentualGeral,
            totalAcertos,
            totalQuestoes: QUESTOES_DIAGNOSTICO.length,
            resultadosPorTopico,
            lacunasIdentificadas,
            rankingTopicos
        };

        // Salvar no usuário
        const usuarios = await lerArquivoJson(paths.USUARIOS, []);
        const idx = usuarios.findIndex(u => u.id === usuario.id);
        if (idx >= 0) {
            garantirDadosEstudo(usuarios[idx]);
            usuarios[idx].estudos.diagnostico = diagnosticoSalvo;
            usuarios[idx].estudos.cronogramaSemanal = cronogramaSemanal;
            usuarios[idx].estudos.atividades.push({
                tipo: "diagnostico",
                titulo: `Diagnóstico Inicial (${nivel} - ${percentualGeral}%)`,
                data: agora
            });
            await salvarArquivoJson(paths.USUARIOS, usuarios);
        }

        return res.json({
            sucesso: true,
            mensagem: "Diagnóstico processado com sucesso e trilha personalizada gerada!",
            diagnostico: diagnosticoSalvo,
            cronogramaSemanal,
            detalhes: correcoesIndividuais
        });
    } catch (err) {
        return res.status(500).json({ erro: "Erro ao processar diagnóstico." });
    }
}

module.exports = {
    QUESTOES_DIAGNOSTICO,
    obterQuestoes,
    processar
};
