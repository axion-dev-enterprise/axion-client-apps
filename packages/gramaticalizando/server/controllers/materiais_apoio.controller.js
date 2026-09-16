const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson } = require("../data/jsonStore");
const { gerarBufferMaterial } = require("../utils/materialPdfService");

async function obterMateriaisPersistidos() {
    let materiais = await lerArquivoJson(paths.MATERIAIS_APOIO);
    if (!Array.isArray(materiais)) {
        materiais = [];
        await salvarArquivoJson(paths.MATERIAIS_APOIO, materiais);
    } else {
        // Assegura que arquivoUrl aponte para o endpoint canônico
        let precisaSalvar = false;
        materiais.forEach(m => {
            if (!m.arquivoUrl || m.arquivoUrl.includes('gramaticalizando.com.br')) {
                m.arquivoUrl = `/api/materiais-apoio/${m.id}/download`;
                precisaSalvar = true;
            }
        });
        if (precisaSalvar) {
            await salvarArquivoJson(paths.MATERIAIS_APOIO, materiais);
        }
    }
    return materiais;
}

// Aluno / Público
async function listar(req, res) {
    try {
        const materiais = await obterMateriaisPersistidos();
        return res.json({ sucesso: true, materiais });
    } catch (erro) {
        console.error("Erro ao listar materiais:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar materiais de apoio." });
    }
}

// Admin
async function listarAdmin(req, res) {
    try {
        const materiais = await obterMateriaisPersistidos();
        return res.json({ sucesso: true, materiais });
    } catch (erro) {
        console.error("Erro listar materiais admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao listar materiais." });
    }
}

async function criarAdmin(req, res) {
    try {
        const titulo = String(req.body.titulo || "").trim();
        const descricao = String(req.body.descricao || "").trim();
        const moduloId = String(req.body.moduloId || "geral").trim();
        const nomeModulo = String(req.body.nomeModulo || "Geral").trim();
        const tipo = String(req.body.tipo || "pdf").trim();
        const arquivoUrl = String(req.body.arquivoUrl || "").trim();
        const tamanho = String(req.body.tamanho || "1.5 MB").trim();
        const paginas = Number(req.body.paginas) || 10;

        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título para o material." });
        }

        const materiais = await obterMateriaisPersistidos();
        const agora = new Date().toISOString();

        const novo = {
            id: crypto.randomUUID(),
            titulo,
            descricao,
            moduloId,
            nomeModulo,
            tipo,
            arquivoUrl: arquivoUrl || "https://gramaticalizando.com.br/docs/material-exemplo.pdf",
            tamanho,
            paginas,
            criadoEm: agora,
            atualizadoEm: agora
        };

        materiais.unshift(novo);
        await salvarArquivoJson(paths.MATERIAIS_APOIO, materiais);

        return res.status(201).json({ sucesso: true, material: novo });
    } catch (erro) {
        console.error("Erro criar material admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar material de apoio." });
    }
}

async function atualizarAdmin(req, res) {
    try {
        const id = req.params.id;
        const materiais = await obterMateriaisPersistidos();
        const idx = materiais.findIndex(m => m.id === id);

        if (idx === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Material não encontrado." });
        }

        const titulo = String(req.body.titulo || "").trim();
        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido." });
        }

        materiais[idx].titulo = titulo;
        if (req.body.descricao !== undefined) materiais[idx].descricao = String(req.body.descricao).trim();
        if (req.body.moduloId !== undefined) materiais[idx].moduloId = String(req.body.moduloId).trim();
        if (req.body.nomeModulo !== undefined) materiais[idx].nomeModulo = String(req.body.nomeModulo).trim();
        if (req.body.tipo !== undefined) materiais[idx].tipo = String(req.body.tipo).trim();
        if (req.body.arquivoUrl !== undefined) materiais[idx].arquivoUrl = String(req.body.arquivoUrl).trim();
        if (req.body.tamanho !== undefined) materiais[idx].tamanho = String(req.body.tamanho).trim();
        if (req.body.paginas !== undefined) materiais[idx].paginas = Number(req.body.paginas) || 1;
        materiais[idx].atualizadoEm = new Date().toISOString();

        await salvarArquivoJson(paths.MATERIAIS_APOIO, materiais);
        return res.json({ sucesso: true, material: materiais[idx] });
    } catch (erro) {
        console.error("Erro atualizar material admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar material." });
    }
}

async function excluirAdmin(req, res) {
    try {
        const id = req.params.id;
        const materiais = await obterMateriaisPersistidos();
        const idx = materiais.findIndex(m => m.id === id);

        if (idx === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Material não encontrado." });
        }

        materiais.splice(idx, 1);
        await salvarArquivoJson(paths.MATERIAIS_APOIO, materiais);

        return res.json({ sucesso: true, mensagem: "Material excluído com sucesso." });
    } catch (erro) {
        console.error("Erro excluir material admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir material." });
    }
}

async function visualizarPdf(req, res) {
    try {
        const id = req.params.id;
        const materiais = await obterMateriaisPersistidos();
        const material = materiais.find(m => m.id === id);

        const pdfBuffer = gerarBufferMaterial(id, material);
        const safeTitle = (material?.titulo || 'material-de-apoio')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/gi, '_');

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${safeTitle}.pdf"`);
        res.setHeader("Content-Length", pdfBuffer.length);
        res.setHeader("X-Frame-Options", "SAMEORIGIN");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://gramaticalizando.axionenterprise.cloud");
        return res.send(pdfBuffer);
    } catch (erro) {
        console.error("Erro visualizar PDF:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao gerar PDF para visualização." });
    }
}

async function downloadPdf(req, res) {
    try {
        const id = req.params.id;
        const materiais = await obterMateriaisPersistidos();
        const material = materiais.find(m => m.id === id);

        const pdfBuffer = gerarBufferMaterial(id, material);
        const safeTitle = (material?.titulo || 'material-de-apoio')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/gi, '_');

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.pdf"`);
        res.setHeader("Content-Length", pdfBuffer.length);
        return res.send(pdfBuffer);
    } catch (erro) {
        console.error("Erro download PDF:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao baixar PDF." });
    }
}

module.exports = {
    listar,
    listarAdmin,
    criarAdmin,
    atualizarAdmin,
    excluirAdmin,
    visualizarPdf,
    downloadPdf
};
