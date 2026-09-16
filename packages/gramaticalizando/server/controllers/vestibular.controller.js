const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

const DADOS_PADRAO = {
    videoaulas: [
        {
            id: "vest-vid-01",
            titulo: "Redação ENEM Nota 1000: Repertório Legitimado e Proposta de Intervenção",
            vestibular: "ENEM",
            duracao: "45 min",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            descricao: "Nesta aula magna exclusiva, a Profª Wilma desconstrói os 5 critérios da matriz de correção do ENEM, apresentando conectivos interparágrafos de alto impacto e modelos de tese infalíveis.",
            professor: "Profª Wilma",
            criadoEm: "2026-09-10T14:00:00.000Z"
        },
        {
            id: "vest-vid-02",
            titulo: "Discursiva de Português e Literatura da UERJ: Desvendando a Banca",
            vestibular: "UERJ",
            duracao: "52 min",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            descricao: "Guia estratégico para a prova discursiva da UERJ. Como estruturar a argumentação dialética, interpretação textual profunda das obras indicadas e coesão textual refinada.",
            professor: "Profª Wilma",
            criadoEm: "2026-09-11T16:30:00.000Z"
        },
        {
            id: "vest-vid-03",
            titulo: "FUVEST & UNICAMP: Sintaxe Expressiva, Ironia e Coesão Avançada",
            vestibular: "FUVEST",
            duracao: "38 min",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            descricao: "Análise das peculiaridades dos vestibulares paulistas. Como fugir do lugar-comum, utilizar figuras de sintaxe com propriedade e garantir nota máxima na expressão escrita.",
            professor: "Profª Wilma",
            criadoEm: "2026-09-12T10:15:00.000Z"
        },
        {
            id: "vest-vid-04",
            titulo: "Funções da Linguagem e Variação Linguística Aplicada aos Vestibulares",
            vestibular: "Geral",
            duracao: "40 min",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            descricao: "Revisão focada nos temas mais recorrentes de Língua Portuguesa em todos os exames vestibulares do país com resolução comentada de questões clássicas.",
            professor: "Profª Wilma",
            criadoEm: "2026-09-13T11:00:00.000Z"
        }
    ],
    temas: [
        {
            id: "vest-tema-01",
            titulo: "A democratização do acesso aos avanços da inteligência artificial e a inclusão digital no Brasil",
            vestibular: "ENEM",
            ano: "2026",
            instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema, apresentando proposta de intervenção que respeite os direitos humanos.",
            textosMotivadores: "Texto I: A revolução da inteligência artificial redefine postos de trabalho e métodos educacionais em todo o globo...\nTexto II: Dados do Cetic.br apontam disparidade severa no acesso a ferramentas tecnológicas entre classes socioeconômicas no Brasil.",
            dataLimite: "2026-11-30"
        },
        {
            id: "vest-tema-02",
            titulo: "A persistência da desigualdade de gênero no trabalho de cuidado não remunerado",
            vestibular: "ENEM",
            ano: "2026",
            instrucoes: "Redija texto dissertativo-argumentativo analisando como a sobrecarga do trabalho invisível afeta o desenvolvimento educacional e profissional das mulheres brasileiras.",
            textosMotivadores: "Texto I: O trabalho reprodutivo e de cuidado sustenta as engrenagens econômicas da sociedade contemporânea...",
            dataLimite: "2026-10-31"
        },
        {
            id: "vest-tema-03",
            titulo: "O individualismo exacerbado e o colapso do sentimento comunitário na vida urbana",
            vestibular: "UERJ",
            ano: "2026",
            instrucoes: "Elabore uma dissertação argumentativa com posicionamento crítico e reflexivo sobre a perda da coletividade nas metrópoles contemporâneas.",
            textosMotivadores: "Texto I: Fragmento de obra literária da UERJ destacando o isolamento dos indivíduos em condomínios e telas digitais...",
            dataLimite: "2026-12-15"
        },
        {
            id: "vest-tema-04",
            titulo: "A ciência sob suspeita: as fronteiras entre o ceticismo legítimo e o negacionismo perigoso",
            vestibular: "FUVEST",
            ano: "2026",
            instrucoes: "Apresente uma reflexão densa e fundamentada acerca dos limites do questionamento científico e a disseminação de narrativas anticientíficas na esfera pública.",
            textosMotivadores: "Texto I: A epistemologia moderna fundamenta-se na dúvida metódica, contudo o obscurantismo contemporâneo desarticula consensos civilizatórios comprovados...",
            dataLimite: "2026-12-20"
        }
    ],
    redacoes: []
};

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
            videoaulas: dados.videoaulas,
            temas: dados.temas
        });
    } catch (erro) {
        return res.json({
            sucesso: true,
            videoaulas: DADOS_PADRAO.videoaulas,
            temas: DADOS_PADRAO.temas
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
