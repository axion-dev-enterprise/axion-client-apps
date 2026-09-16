const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

async function obterQuestoesPersistidas() {
    let dados = await lerArquivoJson(paths.DIAGNOSTICO);
    if (!Array.isArray(dados)) {
        dados = [];
    }
    return dados;
}

async function obterQuestoes(req, res) {
    try {
        const questoes = await obterQuestoesPersistidas();
        // Retorna as questões sem o gabarito nem explicação
        const questoesSemGabarito = questoes.map(q => ({
            id: q.id,
            topico: q.topico,
            nomeTopico: q.nomeTopico,
            enunciado: q.enunciado,
            alternativas: (q.alternativas || []).map((alt, idx) => ({
                id: alt.id || ["a", "b", "c", "d", "e"][idx],
                letra: (alt.letra || alt.id || ["A", "B", "C", "D", "E"][idx]).toUpperCase(),
                texto: alt.texto
            }))
        }));

        return res.json({
            sucesso: true,
            totalQuestoes: questoesSemGabarito.length,
            questoes: questoesSemGabarito
        });
    } catch (erro) {
        console.error("Erro ao obter questões do diagnóstico:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar diagnóstico." });
    }
}

// ADMIN: Obter todas as questões completas com gabaritos
async function obterDiagnosticoAdmin(req, res) {
    try {
        const questoes = await obterQuestoesPersistidas();
        return res.json({
            sucesso: true,
            totalQuestoes: questoes.length,
            questoes,
            topicosDisponiveis: [
                { chave: "interpretacao", nome: "Interpretação de Texto" },
                { chave: "sintaxe", nome: "Análise Sintática" },
                { chave: "concordancia", nome: "Concordância Verbal e Nominal" },
                { chave: "crase", nome: "Emprego do Acento Indicativo de Crase" },
                { chave: "pontuacao", nome: "Pontuação e Emprego da Vírgula" },
                { chave: "morfologia", nome: "Morfologia e Classes Gramaticais" }
            ],
            criteriosNivel: {
                iniciante: "Abaixo de 50%",
                intermediario: "50% a 79%",
                avancado: "80% ou mais"
            }
        });
    } catch (erro) {
        console.error("Erro obter diagnostico admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao obter diagnóstico admin." });
    }
}

async function criarQuestaoAdmin(req, res) {
    try {
        const crypto = require("crypto");
        const enunciado = String(req.body.enunciado || "").trim();
        const topico = String(req.body.topico || "sintaxe").trim();
        const nomeTopico = String(req.body.nomeTopico || "Análise Sintática").trim();
        const respostaCorreta = String(req.body.respostaCorreta || "a").trim().toLowerCase();
        const explicacao = String(req.body.explicacao || "").trim();
        const alternativas = Array.isArray(req.body.alternativas) ? req.body.alternativas : [];

        if (enunciado.length < 5) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um enunciado válido para a questão." });
        }

        const questoes = await obterQuestoesPersistidas();
        const nova = {
            id: `diag-${topico}-${crypto.randomUUID().slice(0, 6)}`,
            topico,
            nomeTopico,
            enunciado,
            alternativas: alternativas.length > 0 ? alternativas : [
                { id: "a", texto: "Alternativa A" },
                { id: "b", texto: "Alternativa B" },
                { id: "c", texto: "Alternativa C" },
                { id: "d", texto: "Alternativa D" }
            ],
            respostaCorreta,
            explicacao
        };

        questoes.push(nova);
        await salvarArquivoJson(paths.DIAGNOSTICO, questoes);

        return res.status(201).json({ sucesso: true, questao: nova });
    } catch (erro) {
        console.error("Erro criar questão diagnóstico:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar questão do diagnóstico." });
    }
}

async function atualizarQuestaoAdmin(req, res) {
    try {
        const id = req.params.id;
        const questoes = await obterQuestoesPersistidas();
        const idx = questoes.findIndex(q => q.id === id);

        if (idx === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Questão não encontrada." });
        }

        const enunciado = String(req.body.enunciado || "").trim();
        if (enunciado.length < 5) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um enunciado válido." });
        }

        questoes[idx].enunciado = enunciado;
        if (req.body.topico) questoes[idx].topico = String(req.body.topico).trim();
        if (req.body.nomeTopico) questoes[idx].nomeTopico = String(req.body.nomeTopico).trim();
        if (req.body.respostaCorreta) questoes[idx].respostaCorreta = String(req.body.respostaCorreta).trim().toLowerCase();
        if (req.body.explicacao !== undefined) questoes[idx].explicacao = String(req.body.explicacao).trim();
        if (Array.isArray(req.body.alternativas)) questoes[idx].alternativas = req.body.alternativas;

        await salvarArquivoJson(paths.DIAGNOSTICO, questoes);
        return res.json({ sucesso: true, questao: questoes[idx] });
    } catch (erro) {
        console.error("Erro atualizar questão diagnóstico:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar questão." });
    }
}

async function excluirQuestaoAdmin(req, res) {
    try {
        const id = req.params.id;
        const questoes = await obterQuestoesPersistidas();
        const idx = questoes.findIndex(q => q.id === id);

        if (idx === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Questão não encontrada." });
        }

        questoes.splice(idx, 1);
        await salvarArquivoJson(paths.DIAGNOSTICO, questoes);

        return res.json({ sucesso: true, mensagem: "Questão excluída com sucesso." });
    } catch (erro) {
        console.error("Erro excluir questão diagnóstico:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir questão." });
    }
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

        // Salvar no perfil do usuário caso autenticado
        if (usuario && usuario.id) {
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
    obterQuestoes,
    processar,
    obterDiagnosticoAdmin,
    criarQuestaoAdmin,
    atualizarQuestaoAdmin,
    excluirQuestaoAdmin
};
