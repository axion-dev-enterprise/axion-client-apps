const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const paths = require("../config/paths");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

function formatarTamanho(bytes) {
    if (!bytes || isNaN(bytes)) return "0 KB";
    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function sanitizarNomeArquivo(nomeOriginal) {
    if (!nomeOriginal || typeof nomeOriginal !== "string") return "arquivo";
    const normalizado = nomeOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizado.replace(/[^a-zA-Z0-9._-]/g, "_");
}

// Upload via Base64 JSON ou multipart
async function uploadBase64(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario) {
            return res.status(401).json({ sucesso: false, mensagem: "Faça login para realizar uploads." });
        }

        const { nome, tipo, dados } = req.body || {};
        if (!dados) {
            return res.status(400).json({ sucesso: false, mensagem: "Nenhum dado de arquivo enviado." });
        }

        const isVideo = tipo === "video" || (nome && /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(nome));
        const subpasta = isVideo ? "videos" : "pdf";
        const dirDestino = isVideo ? paths.UPLOADS_VIDEOS_DIR : paths.UPLOADS_PDF_DIR;

        if (!fs.existsSync(dirDestino)) {
            fs.mkdirSync(dirDestino, { recursive: true });
        }

        // Remove prefixo data:*/*;base64, se presente
        const cleanBase64 = dados.includes(",") ? dados.split(",")[1] : dados;
        const buffer = Buffer.from(cleanBase64, "base64");

        const safeOriginalName = sanitizarNomeArquivo(nome || (isVideo ? "video.mp4" : "documento.pdf"));
        const uniquePrefix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
        const finalFilename = `${uniquePrefix}-${safeOriginalName}`;
        const filePath = path.join(dirDestino, finalFilename);

        fs.writeFileSync(filePath, buffer);

        const tamanhoBytes = buffer.length;
        const tamanhoFormatado = formatarTamanho(tamanhoBytes);
        const urlPublica = `/uploads/${subpasta}/${finalFilename}`;

        return res.status(201).json({
            sucesso: true,
            mensagem: `${isVideo ? "Vídeo" : "PDF"} enviado e processado com sucesso!`,
            url: urlPublica,
            filename: safeOriginalName,
            tamanho: tamanhoFormatado,
            tamanhoBytes,
            tipo: isVideo ? "video" : "pdf",
            salvoEm: new Date().toISOString()
        });
    } catch (erro) {
        console.error("Erro no upload de arquivo:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Falha ao salvar arquivo no servidor." });
    }
}

// Upload via Stream direto (ideal para vídeos grandes ou PDFs pesados)
async function uploadStream(req, res) {
    try {
        const usuario = obterUsuarioAutenticado(req);
        if (!usuario) {
            return res.status(401).json({ sucesso: false, mensagem: "Faça login para realizar uploads." });
        }

        const nomeParam = req.query.nome || req.headers["x-filename"] || "arquivo";
        const tipoParam = req.query.tipo || (nomeParam && /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(nomeParam) ? "video" : "pdf");
        const isVideo = tipoParam === "video" || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(nomeParam);

        const subpasta = isVideo ? "videos" : "pdf";
        const dirDestino = isVideo ? paths.UPLOADS_VIDEOS_DIR : paths.UPLOADS_PDF_DIR;

        if (!fs.existsSync(dirDestino)) {
            fs.mkdirSync(dirDestino, { recursive: true });
        }

        const safeOriginalName = sanitizarNomeArquivo(nomeParam);
        const uniquePrefix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
        const finalFilename = `${uniquePrefix}-${safeOriginalName}`;
        const filePath = path.join(dirDestino, finalFilename);

        const writeStream = fs.createWriteStream(filePath);
        let totalBytes = 0;

        req.on("data", chunk => {
            totalBytes += chunk.length;
        });

        req.pipe(writeStream);

        writeStream.on("finish", () => {
            const tamanhoFormatado = formatarTamanho(totalBytes);
            const urlPublica = `/uploads/${subpasta}/${finalFilename}`;

            return res.status(201).json({
                sucesso: true,
                mensagem: `${isVideo ? "Vídeo" : "PDF"} recebido e armazenado com sucesso!`,
                url: urlPublica,
                filename: safeOriginalName,
                tamanho: tamanhoFormatado,
                tamanhoBytes: totalBytes,
                tipo: isVideo ? "video" : "pdf",
                salvoEm: new Date().toISOString()
            });
        });

        writeStream.on("error", err => {
            console.error("Erro ao gravar stream no disco:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao gravar arquivo no disco." });
        });
    } catch (erro) {
        console.error("Erro no upload por stream:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro interno no processamento do stream." });
    }
}

module.exports = {
    uploadBase64,
    uploadStream
};
