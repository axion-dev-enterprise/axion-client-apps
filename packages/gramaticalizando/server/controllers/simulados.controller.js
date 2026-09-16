const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

async function obterSimuladosPersistidos() {
    let simulados = await lerArquivoJson(paths.SIMULADOS);
    if (!Array.isArray(simulados)) {
        simulados = [];
        await salvarArquivoJson(paths.SIMULADOS, simulados);
    }
    return simulados;
}

// Público / Alunos (questões sem exibir resposta correta de imediato)
async function listar(req, res) {
    try {
        const simulados = await obterSimuladosPersistidos();
        const user = obterUsuarioAutenticado(req);
        const userSimuladosMap = {};

        if (user && user.id) {
            try {
                const usuarios = await lerArquivoJson(paths.USUARIOS);
                const usuario = usuarios.find(u => u.id === user.id);
                if (usuario && usuario.estudos && Array.isArray(usuario.estudos.simulados)) {
                    usuario.estudos.simulados.forEach(s => {
                        if (!userSimuladosMap[s.simuladoId]) {
                            userSimuladosMap[s.simuladoId] = s;
                        }
                    });
                }
            } catch (errUser) {
                console.warn("Aviso ao mapear simulados do usuário:", errUser.message);
            }
        }

        const lista = simulados
            .filter(s => s.publicado !== false)
            .map(s => {
                const tentativa = userSimuladosMap[s.id];
                return {
                    id: s.id,
                    titulo: s.titulo,
                    descricao: s.descricao,
                    banca: s.banca,
                    tempoMinutos: s.tempoMinutos,
                    totalQuestoes: Array.isArray(s.questoes) ? s.questoes.length : 0,
                    criadoEm: s.criadoEm,
                    concluido: !!tentativa,
                    ultimaNota: tentativa ? tentativa.porcentagem : null,
                    corretas: tentativa ? tentativa.corretas : null,
                    concluidoEm: tentativa ? tentativa.concluidoEm : null
                };
            });

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

        // Persistência no histórico do aluno
        const user = obterUsuarioAutenticado(req);
        if (user && user.id) {
            try {
                const usuarios = await lerArquivoJson(paths.USUARIOS);
                const usuario = usuarios.find(u => u.id === user.id);
                if (usuario) {
                    const estudos = garantirDadosEstudo(usuario);
                    if (!Array.isArray(estudos.simulados)) {
                        estudos.simulados = [];
                    }

                    const agora = new Date().toISOString();
                    const registroSimulado = {
                        id: crypto.randomUUID(),
                        simuladoId: sim.id,
                        titulo: sim.titulo,
                        banca: sim.banca,
                        total,
                        corretas,
                        erradas: total - corretas,
                        porcentagem,
                        respostas,
                        concluidoEm: agora
                    };
                    estudos.simulados.unshift(registroSimulado);

                    // Atualiza exercícios do aluno para refletir nas métricas globais
                    if (!Array.isArray(estudos.exercicios)) {
                        estudos.exercicios = [];
                    }
                    estudos.exercicios.unshift({
                        id: crypto.randomUUID(),
                        exercicioId: sim.id,
                        titulo: `Simulado: ${sim.titulo}`,
                        total,
                        corretas,
                        erradas: total - corretas,
                        porcentagem,
                        tipo: "simulado",
                        concluidoEm: agora
                    });

                    // Registra na timeline de atividades do aluno
                    if (!Array.isArray(estudos.atividades)) {
                        estudos.atividades = [];
                    }
                    estudos.atividades.unshift({
                        id: crypto.randomUUID(),
                        tipo: "simulado",
                        titulo: `Simulado concluído: ${sim.titulo}`,
                        descricao: `${corretas} de ${total} acertos (${porcentagem}% de aproveitamento).`,
                        referenciaId: sim.id,
                        criadoEm: agora
                    });

                    estudos.ultimoAcesso = agora;
                    await salvarArquivoJson(paths.USUARIOS, usuarios);
                }
            } catch (errSave) {
                console.warn("Aviso ao salvar histórico do simulado:", errSave.message);
            }
        }

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
