const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

const SIMULADOS_DEFAULT = [
    {
        id: "sim-vunesp-1",
        titulo: "Simulado Vunesp — Nível Médio & Segurança Pública",
        descricao: "Prova padrão Vunesp com foco em Acentuação, Crase, Regência Verbal e Concordância Nominal.",
        banca: "Vunesp",
        tempoMinutos: 45,
        publicado: true,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        questoes: [
            {
                id: "sim-q-1",
                enunciado: "Assinale a alternativa em que TODAS as palavras são acentuadas pela mesma regra gramatical:",
                alternativas: [
                    { id: "a", texto: "Árvore, lâmpada, pássaro, pêssego." },
                    { id: "b", texto: "Café, cipó, você, táxi." },
                    { id: "c", texto: "Saúde, país, baú, ideia." },
                    { id: "d", texto: "Fácil, júri, bíceps, alguém." }
                ],
                respostaCorreta: "a",
                explicacao: "Todas são proparoxítonas e, pela regra geral, todas as proparoxítonas são obrigatoriamente acentuadas."
            },
            {
                id: "sim-q-2",
                enunciado: "Em relação ao Novo Acordo Ortográfico, assinale a opção gramaticalmente correta quanto ao hífen:",
                alternativas: [
                    { id: "a", texto: "Ele comprou um remédio antiinflamatório na farmácia." },
                    { id: "b", texto: "A empresa adquiriu um novo micro-ondas." },
                    { id: "c", texto: "O condomínio instalou um moderno sistema antiincêndio." },
                    { id: "d", texto: "O jovem tem excelente auto-estima." }
                ],
                respostaCorreta: "b",
                explicacao: "Vogais iguais separam-se com hífen (micro-ondas, anti-inflamatório). Autoestima e anti-incêndio seguem suas respectivas regras."
            },
            {
                id: "sim-q-3",
                enunciado: "Indique a alternativa em que o uso do acento grave indicativo de crase está estritamente correto:",
                alternativas: [
                    { id: "a", texto: "Obedecemos às ordens do comandante sem hesitar." },
                    { id: "b", texto: "O rapaz assistiu à um filme emocionante ontem." },
                    { id: "c", texto: "Entregou a encomenda à ela durante a tarde." },
                    { id: "d", texto: "Voltamos à caminhar assim que o sol se pôs." }
                ],
                respostaCorreta: "a",
                explicacao: "Quem obedece, obedece A algo/alguém (verbo transitivo indireto). A preposição 'a' + o artigo feminino 'as' resulta em 'às ordens'."
            },
            {
                id: "sim-q-4",
                enunciado: "Em 'Havia muitas pessoas interessadas no concurso', a função sintática de 'muitas pessoas' é:",
                alternativas: [
                    { id: "a", texto: "Sujeito simples." },
                    { id: "b", texto: "Objeto direto." },
                    { id: "c", texto: "Predicativo do sujeito." },
                    { id: "d", texto: "Adjunto adnominal." }
                ],
                respostaCorreta: "b",
                explicacao: "O verbo HAVER no sentido de existir é impessoal e não tem sujeito. O termo que o complementa funciona como objeto direto."
            }
        ]
    },
    {
        id: "sim-fgv-1",
        titulo: "Simulado FGV — Domínio Morfossintático & Semântica",
        descricao: "Questões estilo Fundação Getulio Vargas exigindo raciocínio textual refinado e sintaxe de regência.",
        banca: "FGV",
        tempoMinutos: 60,
        publicado: true,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        questoes: [
            {
                id: "sim-fgv-q-1",
                enunciado: "Assinale a frase em que o pronome relativo NÃO vem precedido de preposição exigida pela regência verbal:",
                alternativas: [
                    { id: "a", texto: "Este é o projeto a que todos nós aspiramos." },
                    { id: "b", texto: "A lei a que desobedeceram acarretou multas severas." },
                    { id: "c", texto: "Os livros que o professor aludiu já estão esgotados." },
                    { id: "d", texto: "O cargo a que ele concorre exige pós-graduação." }
                ],
                respostaCorreta: "c",
                explicacao: "Quem alude, alude A algo (aludir a). O correto seria: 'Os livros a que o professor aludiu'."
            },
            {
                id: "sim-fgv-q-2",
                enunciado: "Em qual oração a palavra 'se' atua como partícula apassivadora (pronome apassivador)?",
                alternativas: [
                    { id: "a", texto: "Alugam-se salas comerciais no centro da cidade." },
                    { id: "b", texto: "Necessita-se de profissionais com liderança." },
                    { id: "c", texto: "Ela olhou-se atentamente no espelho do hall." },
                    { id: "d", texto: "Vive-se com tranquilidade no campo." }
                ],
                respostaCorreta: "a",
                explicacao: "Em 'Alugam-se salas', o verbo é transitivo direto e 'salas comerciais' é sujeito paciente (salas comerciais são alugadas)."
            }
        ]
    }
];

async function obterSimuladosPersistidos() {
    let simulados = await lerArquivoJson(paths.SIMULADOS);
    if (!Array.isArray(simulados) || simulados.length === 0) {
        simulados = SIMULADOS_DEFAULT;
        await salvarArquivoJson(paths.SIMULADOS, simulados);
    }
    return simulados;
}

// Público / Alunos (questões sem exibir resposta correta de imediato)
async function listar(req, res) {
    try {
        const simulados = await obterSimuladosPersistidos();
        const lista = simulados
            .filter(s => s.publicado !== false)
            .map(s => ({
                id: s.id,
                titulo: s.titulo,
                descricao: s.descricao,
                banca: s.banca,
                tempoMinutos: s.tempoMinutos,
                totalQuestoes: Array.isArray(s.questoes) ? s.questoes.length : 0,
                criadoEm: s.criadoEm
            }));

        return res.json({ sucesso: true, simulados: lista });
    } catch (erro) {
        console.error("Erro ao listar simulados:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar simulados." });
    }
}

async function obterPorId(req, res) {
    try {
        const simulados = await obterSimuladosPersistidos();
        const sim = simulados.find(s => s.id === req.params.id);
        if (!sim) {
            return res.status(404).json({ sucesso: false, mensagem: "Simulado não encontrado." });
        }

        const user = obterUsuarioAutenticado(req);
        const isAdmin = user?.tipo === "admin";

        const questoesFormatadas = (sim.questoes || []).map(q => {
            if (isAdmin) return q;
            return {
                id: q.id,
                enunciado: q.enunciado,
                alternativas: q.alternativas
            };
        });

        return res.json({
            sucesso: true,
            simulado: {
                ...sim,
                questoes: questoesFormatadas
            }
        });
    } catch (erro) {
        console.error("Erro ao obter simulado:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar simulado." });
    }
}

// ADMIN CRUD
async function listarAdmin(req, res) {
    try {
        const simulados = await obterSimuladosPersistidos();
        return res.json({ sucesso: true, simulados });
    } catch (erro) {
        console.error("Erro ao listar simulados admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao listar simulados." });
    }
}

async function criarAdmin(req, res) {
    try {
        const titulo = String(req.body.titulo || "").trim();
        const descricao = String(req.body.descricao || "").trim();
        const banca = String(req.body.banca || "Geral").trim();
        const tempoMinutos = Number(req.body.tempoMinutos) || 60;
        const publicado = req.body.publicado !== undefined ? Boolean(req.body.publicado) : true;
        const questoes = Array.isArray(req.body.questoes) ? req.body.questoes : [];

        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido para o simulado." });
        }

        const simulados = await obterSimuladosPersistidos();
        const agora = new Date().toISOString();

        const novo = {
            id: crypto.randomUUID(),
            titulo,
            descricao,
            banca,
            tempoMinutos,
            publicado,
            questoes: questoes.map((q, idx) => ({
                id: q.id || crypto.randomUUID(),
                enunciado: String(q.enunciado || "").trim(),
                alternativas: Array.isArray(q.alternativas) ? q.alternativas : [],
                respostaCorreta: q.respostaCorreta !== undefined ? String(q.respostaCorreta) : "0",
                explicacao: String(q.explicacao || "").trim()
            })),
            criadoEm: agora,
            atualizadoEm: agora
        };

        simulados.unshift(novo);
        await salvarArquivoJson(paths.SIMULADOS, simulados);

        return res.status(201).json({ sucesso: true, simulado: novo });
    } catch (erro) {
        console.error("Erro ao criar simulado admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar novo simulado." });
    }
}

async function atualizarAdmin(req, res) {
    try {
        const id = req.params.id;
        const simulados = await obterSimuladosPersistidos();
        const indice = simulados.findIndex(s => s.id === id);

        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Simulado não encontrado." });
        }

        const titulo = String(req.body.titulo || "").trim();
        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido." });
        }

        simulados[indice].titulo = titulo;
        if (req.body.descricao !== undefined) simulados[indice].descricao = String(req.body.descricao).trim();
        if (req.body.banca !== undefined) simulados[indice].banca = String(req.body.banca).trim();
        if (req.body.tempoMinutos !== undefined) simulados[indice].tempoMinutos = Number(req.body.tempoMinutos) || 60;
        if (req.body.publicado !== undefined) simulados[indice].publicado = Boolean(req.body.publicado);
        if (Array.isArray(req.body.questoes)) {
            simulados[indice].questoes = req.body.questoes.map(q => ({
                id: q.id || crypto.randomUUID(),
                enunciado: String(q.enunciado || "").trim(),
                alternativas: Array.isArray(q.alternativas) ? q.alternativas : [],
                respostaCorreta: q.respostaCorreta !== undefined ? String(q.respostaCorreta) : "0",
                explicacao: String(q.explicacao || "").trim()
            }));
        }
        simulados[indice].atualizadoEm = new Date().toISOString();

        await salvarArquivoJson(paths.SIMULADOS, simulados);
        return res.json({ sucesso: true, simulado: simulados[indice] });
    } catch (erro) {
        console.error("Erro ao atualizar simulado admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar alterações no simulado." });
    }
}

async function excluirAdmin(req, res) {
    try {
        const id = req.params.id;
        const simulados = await obterSimuladosPersistidos();
        const indice = simulados.findIndex(s => s.id === id);

        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Simulado não encontrado." });
        }

        simulados.splice(indice, 1);
        await salvarArquivoJson(paths.SIMULADOS, simulados);

        return res.json({ sucesso: true, mensagem: "Simulado excluído com sucesso." });
    } catch (erro) {
        console.error("Erro ao excluir simulado admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir simulado." });
    }
}

async function finalizarSimulado(req, res) {
    try {
        const id = req.params.id;
        const respostas = req.body.respostas || {};
        const simulados = await obterSimuladosPersistidos();
        const sim = simulados.find(s => s.id === id);

        if (!sim) {
            return res.status(404).json({ sucesso: false, mensagem: "Simulado não encontrado." });
        }

        let corretas = 0;
        const total = (sim.questoes || []).length;
        const correcao = (sim.questoes || []).map(q => {
            const enviada = String(respostas[q.id] || "");
            const correta = String(q.respostaCorreta || "");
            const acertou = enviada.toLowerCase() === correta.toLowerCase();
            if (acertou) corretas += 1;
            return {
                id: q.id,
                respostaAluno: enviada,
                respostaCorreta: correta,
                acertou,
                explicacao: q.explicacao
            };
        });

        const porcentagem = total > 0 ? Math.round((corretas / total) * 100) : 0;

        return res.json({
            sucesso: true,
            resultado: {
                total,
                corretas,
                erradas: total - corretas,
                porcentagem,
                correcao
            }
        });
    } catch (erro) {
        console.error("Erro ao finalizar simulado:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao computar resultado do simulado." });
    }
}

module.exports = {
    listar,
    obterPorId,
    listarAdmin,
    criarAdmin,
    atualizarAdmin,
    excluirAdmin,
    finalizarSimulado
};
