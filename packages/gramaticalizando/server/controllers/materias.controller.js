const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson } = require("../data/jsonStore");

async function listar(req, res) {
    try {
        const [materias, aulas] = await Promise.all([
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        const formatadas = materias.map(m => ({
            id: m.id,
            nome: m.nome,
            criadoEm: m.criadoEm,
            atualizadoEm: m.atualizadoEm,
            totalAulas: aulas.filter(a => a.materiaId === m.id).length
        }));

        return res.json({ sucesso: true, materias: formatadas });
    } catch (erro) {
        console.error("Erro ao listar matérias:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar matérias." });
    }
}

async function obterPorId(req, res) {
    try {
        const materias = await lerArquivoJson(paths.MATERIAS);
        const materia = materias.find(m => m.id === req.params.id);
        if (!materia) {
            return res.status(404).json({ sucesso: false, mensagem: "Matéria não encontrada." });
        }
        return res.json({ sucesso: true, materia });
    } catch (erro) {
        console.error("Erro ao buscar matéria:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar matéria." });
    }
}

async function criar(req, res) {
    try {
        const nome = String(req.body.nome || "").trim();
        if (nome.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um nome válido para a matéria." });
        }

        const materias = await lerArquivoJson(paths.MATERIAS);
        const existente = materias.find(m => m.nome.toLowerCase() === nome.toLowerCase());
        if (existente) {
            return res.status(400).json({ sucesso: false, mensagem: "Já existe uma matéria com esse nome." });
        }

        const agora = new Date().toISOString();
        const nova = {
            id: crypto.randomUUID(),
            nome,
            criadoEm: agora,
            atualizadoEm: agora
        };

        materias.push(nova);
        await salvarArquivoJson(paths.MATERIAS, materias);

        return res.status(201).json({ sucesso: true, materia: nova });
    } catch (erro) {
        console.error("Erro ao criar matéria:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar matéria." });
    }
}

async function atualizar(req, res) {
    try {
        const nome = String(req.body.nome || "").trim();
        if (nome.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um nome válido para a matéria." });
        }

        const materias = await lerArquivoJson(paths.MATERIAS);
        const indice = materias.findIndex(m => m.id === req.params.id);
        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Matéria não encontrada." });
        }

        const duplicada = materias.find(m => m.id !== req.params.id && m.nome.toLowerCase() === nome.toLowerCase());
        if (duplicada) {
            return res.status(400).json({ sucesso: false, mensagem: "Já existe outra matéria com esse nome." });
        }

        materias[indice].nome = nome;
        materias[indice].atualizadoEm = new Date().toISOString();

        await salvarArquivoJson(paths.MATERIAS, materias);
        return res.json({ sucesso: true, materia: materias[indice] });
    } catch (erro) {
        console.error("Erro ao atualizar matéria:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar alterações da matéria." });
    }
}

async function excluir(req, res) {
    try {
        const materiaId = req.params.id;
        const [materias, aulas, exercicios] = await Promise.all([
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS),
            lerArquivoJson(paths.EXERCICIOS)
        ]);

        const indice = materias.findIndex(m => m.id === materiaId);
        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Matéria não encontrada." });
        }

        materias.splice(indice, 1);
        const aulasRestantes = aulas.filter(a => a.materiaId !== materiaId);
        const exerciciosRestantes = exercicios.filter(e => e.materiaId !== materiaId);

        await Promise.all([
            salvarArquivoJson(paths.MATERIAS, materias),
            salvarArquivoJson(paths.AULAS, aulasRestantes),
            salvarArquivoJson(paths.EXERCICIOS, exerciciosRestantes)
        ]);

        return res.json({ sucesso: true, mensagem: "Matéria excluída com sucesso." });
    } catch (erro) {
        console.error("Erro ao excluir matéria:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir matéria." });
    }
}

async function listarAulasDaMateria(req, res) {
    try {
        const materiaId = req.params.materiaId;
        const [materias, aulas] = await Promise.all([
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        const materia = materias.find(m => m.id === materiaId);
        if (!materia) {
            return res.status(404).json({ sucesso: false, mensagem: "Matéria não encontrada." });
        }

        const aulasMateria = aulas.filter(a => a.materiaId === materiaId);
        return res.json({ sucesso: true, materia, aulas: aulasMateria });
    } catch (erro) {
        console.error("Erro ao listar aulas da matéria:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar aulas da matéria." });
    }
}

async function criarAulaNaMateria(req, res) {
    try {
        const materiaId = req.params.materiaId;
        const titulo = String(req.body.titulo || "").trim();
        const conteudo = String(req.body.conteudo || "");
        const videoUrl = String(req.body.videoUrl || "").trim();
        const materialPdfUrl = String(req.body.materialPdfUrl || "").trim();
        const publicado = Boolean(req.body.publicado);

        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido para a aula." });
        }

        const [materias, aulas] = await Promise.all([
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        const materia = materias.find(m => m.id === materiaId);
        if (!materia) {
            return res.status(404).json({ sucesso: false, mensagem: "Matéria não encontrada." });
        }

        const agora = new Date().toISOString();
        const novaAula = {
            id: crypto.randomUUID(),
            materiaId,
            titulo,
            conteudo,
            videoUrl: videoUrl || null,
            materialPdfUrl: materialPdfUrl || null,
            publicado,
            criadoEm: agora,
            atualizadoEm: agora
        };

        aulas.push(novaAula);
        await salvarArquivoJson(paths.AULAS, aulas);

        return res.status(201).json({ sucesso: true, aula: novaAula });
    } catch (erro) {
        console.error("Erro ao criar aula:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar aula." });
    }
}

module.exports = {
    listar,
    obterPorId,
    criar,
    atualizar,
    excluir,
    listarAulasDaMateria,
    criarAulaNaMateria
};
