const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

async function obterDadosVestibular() {
    let dados = await lerArquivoJson(paths.VESTIBULAR);
    if (!dados || typeof dados !== "object") {
        dados = { videoaulas: [], temas: [], redacoes: [] };
        await salvarArquivoJson(paths.VESTIBULAR, dados);
    }
    if (!Array.isArray(dados.videoaulas)) dados.videoaulas = [];
    if (!Array.isArray(dados.temas)) dados.temas = [];
    if (!Array.isArray(dados.redacoes)) dados.redacoes = [];
    return dados;
}

// Retorna videoaulas e temas para a visão do aluno
async function obterConteudoVestibular(req, res) {
    try {
        const dados = await obterDadosVestibular();
        return res.json({
            sucesso: true,
            videoaulas: dados.videoaulas || [],
            temas: dados.temas || []
        });
    } catch (erro) {
        return res.json({
            sucesso: true,
            videoaulas: [],
            temas: []
        });
    }
}

// Lista redações de vestibular enviadas pelo aluno logado
async function listarRedacoesAluno(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario || !usuario.id) {
            return res.json({ sucesso: true, redacoes: [] });
        }
        const dados = await obterDadosVestibular();
        const redacoesAluno = dados.redacoes.filter(r => r.alunoId === usuario.id);
        return res.json({
            sucesso: true,
            redacoes: redacoesAluno
        });
    } catch (erro) {
        return res.json({ sucesso: true, redacoes: [] });
    }
}

// Envia nova redação de vestibular (texto e/ou anexo de arquivo)
async function enviarRedacaoAluno(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario || !usuario.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Faça login para submeter redações." });
        }
        const { temaId, vestibular, texto, arquivoNome, arquivoUrl } = req.body || {};

        if (!temaId) {
            return res.status(400).json({ sucesso: false, mensagem: "Tema é obrigatório." });
        }
        if (!texto && !arquivoNome && !arquivoUrl) {
            return res.status(400).json({ sucesso: false, mensagem: "Envie o texto da redação ou o arquivo PDF." });
        }

        const dados = await obterDadosVestibular();
        const tema = dados.temas.find(t => t.id === temaId);

        const novaRedacao = {
            id: "vest-red-" + crypto.randomUUID().slice(0, 8),
            alunoId: usuario.id,
            alunoNome: usuario.nome || "Aluno",
            alunoEmail: usuario.email || "",
            temaId,
            temaTitulo: tema ? tema.titulo : "Tema Geral de Vestibular",
            vestibular: vestibular || tema?.vestibular || "Geral",
            texto: texto || "",
            arquivoNome: arquivoNome || (arquivoUrl ? "redacao.pdf" : ""),
            arquivoUrl: arquivoUrl || "",
            status: "pendente",
            notaFinal: null,
            criterios: null,
            feedbackProfessora: "",
            enviadoEm: new Date().toISOString(),
            corrigidoEm: null
        };

        dados.redacoes.unshift(novaRedacao);
        await salvarArquivoJson(paths.VESTIBULAR, dados);

        return res.status(201).json({
            sucesso: true,
            mensagem: "Redação de vestibular submetida com sucesso à Profª Wilma!",
            redacao: novaRedacao
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao enviar redação de vestibular." });
    }
}

// Painel do Professor: Lista completa
async function listarAdmin(req, res) {
    try {
        const dados = await obterDadosVestibular();
        return res.json({
            sucesso: true,
            videoaulas: dados.videoaulas,
            temas: dados.temas,
            redacoes: dados.redacoes
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar dados de vestibular para o professor." });
    }
}

// CRUD Videoaulas Admin
async function criarVideoaulaAdmin(req, res) {
    try {
        const { titulo, vestibular, url, duracao, descricao, professor } = req.body || {};
        if (!titulo || !url) {
            return res.status(400).json({ sucesso: false, mensagem: "Título e link do vídeo são obrigatórios." });
        }

        const dados = await obterDadosVestibular();
        const novaVideoaula = {
            id: "vest-vid-" + crypto.randomUUID().slice(0, 8),
            titulo,
            vestibular: vestibular || "ENEM",
            url,
            duracao: duracao || "30 min",
            descricao: descricao || "",
            professor: professor || "Profª Wilma",
            criadoEm: new Date().toISOString()
        };

        dados.videoaulas.unshift(novaVideoaula);
        await salvarArquivoJson(paths.VESTIBULAR, dados);

        return res.status(201).json({
            sucesso: true,
            mensagem: "Videoaula de vestibular adicionada com sucesso!",
            videoaula: novaVideoaula
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar videoaula." });
    }
}

async function atualizarVideoaulaAdmin(req, res) {
    try {
        const { id } = req.params;
        const { titulo, vestibular, url, duracao, descricao, professor } = req.body || {};
        const dados = await obterDadosVestibular();
        const index = dados.videoaulas.findIndex(v => v.id === id);

        if (index === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Videoaula não encontrada." });
        }

        dados.videoaulas[index] = {
            ...dados.videoaulas[index],
            titulo: titulo || dados.videoaulas[index].titulo,
            vestibular: vestibular || dados.videoaulas[index].vestibular,
            url: url || dados.videoaulas[index].url,
            duracao: duracao || dados.videoaulas[index].duracao,
            descricao: descricao !== undefined ? descricao : dados.videoaulas[index].descricao,
            professor: professor || dados.videoaulas[index].professor
        };

        await salvarArquivoJson(paths.VESTIBULAR, dados);
        return res.json({ sucesso: true, mensagem: "Videoaula atualizada!", videoaula: dados.videoaulas[index] });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar videoaula." });
    }
}

async function excluirVideoaulaAdmin(req, res) {
    try {
        const { id } = req.params;
        const dados = await obterDadosVestibular();
        dados.videoaulas = dados.videoaulas.filter(v => v.id !== id);
        await salvarArquivoJson(paths.VESTIBULAR, dados);
        return res.json({ sucesso: true, mensagem: "Videoaula removida com sucesso." });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao remover videoaula." });
    }
}

// CRUD Temas de Redação Admin
async function criarTemaAdmin(req, res) {
    try {
        const { titulo, vestibular, ano, instrucoes, textosMotivadores, dataLimite } = req.body || {};
        if (!titulo) {
            return res.status(400).json({ sucesso: false, mensagem: "Título do tema é obrigatório." });
        }

        const dados = await obterDadosVestibular();
        const novoTema = {
            id: "vest-tema-" + crypto.randomUUID().slice(0, 8),
            titulo,
            vestibular: vestibular || "ENEM",
            ano: ano || new Date().getFullYear().toString(),
            instrucoes: instrucoes || "",
            textosMotivadores: textosMotivadores || "",
            dataLimite: dataLimite || ""
        };

        dados.temas.unshift(novoTema);
        await salvarArquivoJson(paths.VESTIBULAR, dados);

        return res.status(201).json({
            sucesso: true,
            mensagem: "Tema de redação para vestibular criado com sucesso!",
            tema: novoTema
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar tema." });
    }
}

async function atualizarTemaAdmin(req, res) {
    try {
        const { id } = req.params;
        const { titulo, vestibular, ano, instrucoes, textosMotivadores, dataLimite } = req.body || {};
        const dados = await obterDadosVestibular();
        const index = dados.temas.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Tema não encontrado." });
        }

        dados.temas[index] = {
            ...dados.temas[index],
            titulo: titulo || dados.temas[index].titulo,
            vestibular: vestibular || dados.temas[index].vestibular,
            ano: ano || dados.temas[index].ano,
            instrucoes: instrucoes !== undefined ? instrucoes : dados.temas[index].instrucoes,
            textosMotivadores: textosMotivadores !== undefined ? textosMotivadores : dados.temas[index].textosMotivadores,
            dataLimite: dataLimite || dados.temas[index].dataLimite
        };

        await salvarArquivoJson(paths.VESTIBULAR, dados);
        return res.json({ sucesso: true, mensagem: "Tema atualizado!", tema: dados.temas[index] });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar tema." });
    }
}

async function excluirTemaAdmin(req, res) {
    try {
        const { id } = req.params;
        const dados = await obterDadosVestibular();
        dados.temas = dados.temas.filter(t => t.id !== id);
        await salvarArquivoJson(paths.VESTIBULAR, dados);
        return res.json({ sucesso: true, mensagem: "Tema removido com sucesso." });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir tema." });
    }
}

// Correção de Redação de Vestibular pelo Professor
async function corrigirRedacaoAdmin(req, res) {
    try {
        const { id } = req.params;
        const { notaFinal, criterios, feedbackProfessora } = req.body || {};

        const dados = await obterDadosVestibular();
        const index = dados.redacoes.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Redação não encontrada." });
        }

        dados.redacoes[index] = {
            ...dados.redacoes[index],
            status: "corrigida",
            notaFinal: notaFinal !== undefined ? Number(notaFinal) : dados.redacoes[index].notaFinal,
            criterios: criterios || dados.redacoes[index].criterios,
            feedbackProfessora: feedbackProfessora || dados.redacoes[index].feedbackProfessora,
            corrigidoEm: new Date().toISOString()
        };

        await salvarArquivoJson(paths.VESTIBULAR, dados);

        return res.json({
            sucesso: true,
            mensagem: "Redação de vestibular corrigida com sucesso pela Profª Wilma!",
            redacao: dados.redacoes[index]
        });
    } catch (erro) {
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao corrigir redação." });
    }
}

module.exports = {
    obterConteudoVestibular,
    listarRedacoesAluno,
    enviarRedacaoAluno,
    listarAdmin,
    criarVideoaulaAdmin,
    atualizarVideoaulaAdmin,
    excluirVideoaulaAdmin,
    criarTemaAdmin,
    atualizarTemaAdmin,
    excluirTemaAdmin,
    corrigirRedacaoAdmin
};
