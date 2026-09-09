const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

const TEMAS_PADRAO = [
    {
        id: "tema-enem-01",
        titulo: "Os desafios da mobilidade urbana sustentável no Brasil",
        foco: "ENEM",
        instrucoes: "A partir da leitura dos textos motivadores e com base nos conhecimentos construídos ao longo de sua formação, redija texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema, apresentando proposta de intervenção que respeite os direitos humanos. Selecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defesa de seu ponto de vista."
    },
    {
        id: "tema-concurso-01",
        titulo: "O papel do servidor público na garantia dos direitos fundamentais do cidadão",
        foco: "Concursos",
        instrucoes: "Elabore um texto dissertativo-argumentativo abordando os princípios da legalidade, impessoalidade, moralidade, publicidade e eficiência (LIMPE), e como a atuação proba e célere do servidor público impacta diretamente a concretização dos direitos do cidadão."
    },
    {
        id: "tema-enem-02",
        titulo: "A inteligência artificial e os impactos no trabalho e na ética contemporânea",
        foco: "Geral",
        instrucoes: "Discuta como a automação algorítmica e a IA generativa desafiam a formação profissional, a regulação estatal e as relações interpessoais na sociedade atual."
    },
    {
        id: "tema-vestibular-01",
        titulo: "Caminhos para combater a evasão escolar e valorizar o ensino público no Brasil",
        foco: "ENEM / Vestibulares",
        instrucoes: "Analise os fatores socioeconômicos e pedagógicos associados ao abandono escolar e proponha ações concretas para fortalecer a permanência dos jovens nas escolas."
    }
];

async function obterTemas(req, res) {
    return res.json({
        sucesso: true,
        temas: TEMAS_PADRAO
    });
}

async function listarAluno(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario) {
            return res.status(401).json({ erro: "Usuário não autenticado." });
        }

        const redacoes = await lerArquivoJson(paths.REDACOES, []);
        const doAluno = redacoes
            .filter(r => r.usuarioId === usuario.id)
            .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

        return res.json({
            sucesso: true,
            total: doAluno.length,
            redacoes: doAluno
        });
    } catch (err) {
        return res.status(500).json({ erro: "Erro ao listar redações do aluno." });
    }
}

async function enviar(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario) {
            return res.status(401).json({ erro: "Usuário não autenticado." });
        }

        const tema = String(req.body.tema || "").trim();
        const texto = String(req.body.texto || "").trim();
        const arquivoUrl = String(req.body.arquivoUrl || "").trim();

        if (tema.length < 3) {
            return res.status(400).json({ erro: "O tema da redação é obrigatório (mínimo 3 caracteres)." });
        }

        if (texto.length < 50 && !arquivoUrl) {
            return res.status(400).json({ erro: "Envie o texto da redação (mínimo 50 caracteres) ou o link de um arquivo/PDF." });
        }

        const agora = new Date().toISOString();
        const novaRedacao = {
            id: crypto.randomUUID(),
            usuarioId: usuario.id,
            tema,
            texto: texto || null,
            arquivoUrl: arquivoUrl || null,
            status: "pendente", // pendente, em_correcao, corrigida
            notaGeral: null,
            competencias: null,
            feedbackProfessora: null,
            criadoEm: agora,
            atualizadoEm: agora,
            corrigidoEm: null
        };

        const redacoes = await lerArquivoJson(paths.REDACOES, []);
        redacoes.push(novaRedacao);
        await salvarArquivoJson(paths.REDACOES, redacoes);

        // Atualizar atividade de estudo do aluno
        const usuarios = await lerArquivoJson(paths.USUARIOS, []);
        const idx = usuarios.findIndex(u => u.id === usuario.id);
        if (idx >= 0) {
            garantirDadosEstudo(usuarios[idx]);
            usuarios[idx].estudos.atividades.push({
                tipo: "redacao",
                titulo: `Envio de redação: ${tema}`,
                data: agora
            });
            await salvarArquivoJson(paths.USUARIOS, usuarios);
        }

        return res.status(201).json({
            sucesso: true,
            mensagem: "Redação enviada com sucesso para correção da Profª Wilma!",
            redacao: novaRedacao
        });
    } catch (err) {
        console.error("Erro ao enviar redação:", err);
        return res.status(500).json({ erro: err.message || "Erro ao enviar redação." });
    }
}

async function listarAdmin(req, res) {
    try {
        const statusFiltro = req.query.status;
        const [redacoes, usuarios] = await Promise.all([
            lerArquivoJson(paths.REDACOES, []),
            lerArquivoJson(paths.USUARIOS, [])
        ]);

        const mapaUsuarios = new Map(usuarios.map(u => [u.id, { nome: u.nome, email: u.email }]));

        let lista = redacoes.map(r => {
            const usr = mapaUsuarios.get(r.usuarioId) || { nome: "Aluno não encontrado", email: "" };
            return {
                ...r,
                alunoNome: usr.nome,
                alunoEmail: usr.email
            };
        });

        if (statusFiltro) {
            lista = lista.filter(r => r.status === statusFiltro);
        }

        lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

        return res.json({
            sucesso: true,
            total: lista.length,
            redacoes: lista
        });
    } catch (err) {
        return res.status(500).json({ erro: "Erro ao listar redações (admin)." });
    }
}

async function corrigir(req, res) {
    try {
        const id = req.params.id;
        const notaGeral = req.body.notaGeral !== undefined ? Number(req.body.notaGeral) : null;
        const competencias = req.body.competencias || null;
        const feedbackProfessora = String(req.body.feedbackProfessora || "").trim();

        if (notaGeral === null || isNaN(notaGeral) || notaGeral < 0 || notaGeral > 1000) {
            return res.status(400).json({ erro: "A nota geral deve ser um número entre 0 e 1000." });
        }

        if (feedbackProfessora.length < 5) {
            return res.status(400).json({ erro: "O feedback da Profª Wilma é obrigatório (mínimo 5 caracteres)." });
        }

        const redacoes = await lerArquivoJson(paths.REDACOES, []);
        const idx = redacoes.findIndex(r => r.id === id);
        if (idx === -1) {
            return res.status(404).json({ erro: "Redação não encontrada." });
        }

        const agora = new Date().toISOString();
        redacoes[idx].status = "corrigida";
        redacoes[idx].notaGeral = Math.round(notaGeral);
        redacoes[idx].competencias = competencias;
        redacoes[idx].feedbackProfessora = feedbackProfessora;
        redacoes[idx].corrigidoEm = agora;
        redacoes[idx].atualizadoEm = agora;

        await salvarArquivoJson(paths.REDACOES, redacoes);

        return res.json({
            sucesso: true,
            mensagem: "Redação corrigida e nota registrada com sucesso!",
            redacao: redacoes[idx]
        });
    } catch (err) {
        return res.status(500).json({ erro: "Erro ao corrigir redação." });
    }
}

module.exports = {
    obterTemas,
    listarAluno,
    enviar,
    listarAdmin,
    corrigir
};
