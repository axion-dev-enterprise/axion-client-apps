const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

const CRONOGRAMAS_DEFAULT = [
    {
        id: "cron-iniciante",
        titulo: "Cronograma Essencial — Iniciante & Concursos Básicos",
        descricao: "Plano estruturado de 6 dias por semana focado na fixação das regras fundamentais da língua portuguesa.",
        plano: "iniciante",
        dias: [
            { id: "d1", dia: "Segunda-feira", modulo: "Módulo 01: Fonética e Fonologia", aula: "Divisão Silábica & Encontros Vocálicos", duracao: "45 min", tipo: "teoria" },
            { id: "d2", dia: "Terça-feira", modulo: "Módulo 02: Ortografia", aula: "Regras Gerais de Acentuação (Oxítonas e Paroxítonas)", duracao: "35 min", tipo: "teoria" },
            { id: "d3", dia: "Quarta-feira", modulo: "Módulo 02: Ortografia", aula: "Regras do Hífen & Casos Especiais", duracao: "40 min", tipo: "exercicio" },
            { id: "d4", dia: "Quinta-feira", modulo: "Módulo 03: Semântica", aula: "Sinônimos, Antônimos e Polissemia", duracao: "30 min", tipo: "teoria" },
            { id: "d5", dia: "Sexta-feira", modulo: "Redação Prática", aula: "Estruturação do Parágrafo de Introdução", duracao: "50 min", tipo: "redacao" },
            { id: "d6", dia: "Sábado", modulo: "Simulado Semanal", aula: "Treinamento de 20 Questões Gabaritadas", duracao: "60 min", tipo: "simulado" }
        ],
        publicado: true,
        criadoEm: new Date().toISOString()
    },
    {
        id: "cron-medio",
        titulo: "Cronograma Intensivo — Nível Médio & Carreiras Administrativas",
        descricao: "Foco aprofundado em Sintaxe, Crase, Regência e produção semanal de redação dissertativa.",
        plano: "medio",
        dias: [
            { id: "d1", dia: "Segunda-feira", modulo: "Módulo 04: Morfologia", aula: "Classes de Palavras & Verbos Transitivos", duracao: "50 min", tipo: "teoria" },
            { id: "d2", dia: "Terça-feira", modulo: "Módulo 05: Sintaxe", aula: "Termos Essenciais da Oração (Sujeito & Predicado)", duracao: "45 min", tipo: "teoria" },
            { id: "d3", dia: "Quarta-feira", modulo: "Módulo 06: Crase & Regência", aula: "Regência Verbal dos 20 Verbos Mais Cobrados", duracao: "45 min", tipo: "exercicio" },
            { id: "d4", dia: "Quinta-feira", modulo: "Módulo 06: Crase & Regência", aula: "Casos Obrigatórios e Proibitivos de Crase", duracao: "40 min", tipo: "teoria" },
            { id: "d5", dia: "Sexta-feira", modulo: "Laboratório de Redação", aula: "Redação Completa sobre Tema da Semana", duracao: "60 min", tipo: "redacao" },
            { id: "d6", dia: "Sábado", modulo: "Simulado Geral", aula: "Simulado FGV/Vunesp 30 Questões Comentadas", duracao: "75 min", tipo: "simulado" }
        ],
        publicado: true,
        criadoEm: new Date().toISOString()
    }
];

// Obter cronograma para o aluno autenticado
async function obterCronogramaAluno(req, res) {
    try {
        const user = obterUsuarioAutenticado(req);
        if (!user || !user.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        const [usuarios, cronogramasCadastrados] = await Promise.all([
            lerArquivoJson(paths.USUARIOS),
            lerArquivoJson(paths.CRONOGRAMAS).catch(() => CRONOGRAMAS_DEFAULT)
        ]);

        const usuario = usuarios.find(u => u.id === user.id);
        if (!usuario) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
        }

        const estudos = garantirDadosEstudo(usuario);

        // Se o aluno já tem cronograma personalizado gerado pelo diagnóstico ou selecionado
        if (estudos.cronogramaSemanal && Array.isArray(estudos.cronogramaSemanal.dias)) {
            return res.json({
                sucesso: true,
                cronograma: estudos.cronogramaSemanal
            });
        }

        // Caso contrário, pegar o cronograma padrão do plano do aluno
        const listaCronogramas = Array.isArray(cronogramasCadastrados) && cronogramasCadastrados.length > 0
            ? cronogramasCadastrados
            : CRONOGRAMAS_DEFAULT;

        const planoUsuario = String(usuario.plano || "iniciante").toLowerCase();
        let selecionado = listaCronogramas.find(c => c.plano === planoUsuario && c.publicado !== false);
        if (!selecionado) {
            selecionado = listaCronogramas[0] || CRONOGRAMAS_DEFAULT[0];
        }

        // Criar cópia com status de cada dia
        const cronogramaComStatus = {
            id: selecionado.id,
            titulo: selecionado.titulo,
            descricao: selecionado.descricao,
            plano: selecionado.plano,
            dias: selecionado.dias.map(d => ({
                ...d,
                concluido: false
            }))
        };

        // Salvar como cronograma ativo do aluno
        estudos.cronogramaSemanal = cronogramaComStatus;
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        return res.json({
            sucesso: true,
            cronograma: cronogramaComStatus
        });
    } catch (erro) {
        console.error("Erro ao obter cronograma do aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar cronograma." });
    }
}

// Alternar status de conclusão de um item do cronograma
async function toggleItemCronograma(req, res) {
    try {
        const user = obterUsuarioAutenticado(req);
        if (!user || !user.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        const diaId = String(req.body.diaId || "").trim();
        if (!diaId) {
            return res.status(400).json({ sucesso: false, mensagem: "Identificador do dia é obrigatório." });
        }

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const usuario = usuarios.find(u => u.id === user.id);
        if (!usuario) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
        }

        const estudos = garantirDadosEstudo(usuario);
        if (!estudos.cronogramaSemanal || !Array.isArray(estudos.cronogramaSemanal.dias)) {
            return res.status(400).json({ sucesso: false, mensagem: "Nenhum cronograma ativo encontrado." });
        }

        const item = estudos.cronogramaSemanal.dias.find(d => d.id === diaId);
        if (!item) {
            return res.status(404).json({ sucesso: false, mensagem: "Meta não encontrada no cronograma." });
        }

        item.concluido = !item.concluido;
        if (item.concluido) {
            item.concluidoEm = new Date().toISOString();
        } else {
            delete item.concluidoEm;
        }

        await salvarArquivoJson(paths.USUARIOS, usuarios);

        return res.json({
            sucesso: true,
            diaId,
            concluido: item.concluido,
            cronograma: estudos.cronogramaSemanal
        });
    } catch (erro) {
        console.error("Erro ao alternar item do cronograma:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar item do cronograma." });
    }
}

// -----------------------------------------------------------------------------
// CONTROLADORES ADMINISTRATIVOS (PROFESSOR)
// -----------------------------------------------------------------------------

async function listarAdmin(req, res) {
    try {
        let cronogramas = await lerArquivoJson(paths.CRONOGRAMAS).catch(() => null);
        if (!Array.isArray(cronogramas) || cronogramas.length === 0) {
            cronogramas = CRONOGRAMAS_DEFAULT;
            await salvarArquivoJson(paths.CRONOGRAMAS, cronogramas);
        }
        return res.json({ sucesso: true, cronogramas });
    } catch (erro) {
        console.error("Erro listar cronogramas admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar cronogramas." });
    }
}

async function criarAdmin(req, res) {
    try {
        const titulo = String(req.body.titulo || "").trim();
        const descricao = String(req.body.descricao || "").trim();
        const plano = String(req.body.plano || "iniciante").trim().toLowerCase();
        const dias = Array.isArray(req.body.dias) ? req.body.dias : [];
        const publicado = req.body.publicado !== false;

        if (titulo.length < 3) {
            return res.status(400).json({ sucesso: false, mensagem: "Título do cronograma deve ter pelo menos 3 caracteres." });
        }

        let cronogramas = await lerArquivoJson(paths.CRONOGRAMAS).catch(() => []);
        if (!Array.isArray(cronogramas)) cronogramas = [];

        const novoCronograma = {
            id: `cron-${Date.now()}`,
            titulo,
            descricao,
            plano,
            dias: dias.map((d, index) => ({
                id: d.id || `d${index + 1}`,
                dia: d.dia || `Dia ${index + 1}`,
                modulo: d.modulo || "Geral",
                aula: d.aula || "Estudo dirigido",
                duracao: d.duracao || "45 min",
                tipo: d.tipo || "teoria"
            })),
            publicado,
            criadoEm: new Date().toISOString()
        };

        cronogramas.push(novoCronograma);
        await salvarArquivoJson(paths.CRONOGRAMAS, cronogramas);

        return res.status(201).json({ sucesso: true, cronograma: novoCronograma });
    } catch (erro) {
        console.error("Erro criar cronograma admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar cronograma." });
    }
}

async function atualizarAdmin(req, res) {
    try {
        const id = req.params.id;
        let cronogramas = await lerArquivoJson(paths.CRONOGRAMAS).catch(() => []);
        if (!Array.isArray(cronogramas)) cronogramas = [];

        const index = cronogramas.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Cronograma não encontrado." });
        }

        const c = cronogramas[index];
        if (req.body.titulo) c.titulo = String(req.body.titulo).trim();
        if (req.body.descricao !== undefined) c.descricao = String(req.body.descricao).trim();
        if (req.body.plano) c.plano = String(req.body.plano).trim().toLowerCase();
        if (req.body.publicado !== undefined) c.publicado = Boolean(req.body.publicado);
        if (Array.isArray(req.body.dias)) {
            c.dias = req.body.dias.map((d, i) => ({
                id: d.id || `d${i + 1}`,
                dia: d.dia || `Dia ${i + 1}`,
                modulo: d.modulo || "Geral",
                aula: d.aula || "Estudo dirigido",
                duracao: d.duracao || "45 min",
                tipo: d.tipo || "teoria"
            }));
        }
        c.atualizadoEm = new Date().toISOString();

        await salvarArquivoJson(paths.CRONOGRAMAS, cronogramas);

        return res.json({ sucesso: true, cronograma: c });
    } catch (erro) {
        console.error("Erro atualizar cronograma admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar cronograma." });
    }
}

async function excluirAdmin(req, res) {
    try {
        const id = req.params.id;
        let cronogramas = await lerArquivoJson(paths.CRONOGRAMAS).catch(() => []);
        if (!Array.isArray(cronogramas)) cronogramas = [];

        const index = cronogramas.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Cronograma não encontrado." });
        }

        cronogramas.splice(index, 1);
        await salvarArquivoJson(paths.CRONOGRAMAS, cronogramas);

        return res.json({ sucesso: true, mensagem: "Cronograma excluído com sucesso." });
    } catch (erro) {
        console.error("Erro excluir cronograma admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir cronograma." });
    }
}

module.exports = {
    obterCronogramaAluno,
    toggleItemCronograma,
    listarAdmin,
    criarAdmin,
    atualizarAdmin,
    excluirAdmin
};
