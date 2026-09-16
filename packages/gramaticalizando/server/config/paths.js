const path = require("path");
const fs = require("fs");

const ROOT_DIR = path.resolve(__dirname, "../../");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const isVercel = Boolean(process.env.VERCEL);
const LOCAL_DATA_DIR = path.join(ROOT_DIR, "data");
const DATA_DIR = isVercel ? "/tmp/gramaticalizando_data" : LOCAL_DATA_DIR;

if (isVercel) {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        const jsonFiles = [
            "usuarios.json",
            "materias.json",
            "aulas.json",
            "cursos.json",
            "exercicios.json",
            "categorias.json",
            "redacoes.json",
            "cronogramas.json",
            "simulados.json",
            "diagnostico.json",
            "materiais_apoio.json",
            "vestibular.json"
        ];
        for (const file of jsonFiles) {
            const destPath = path.join(DATA_DIR, file);
            const srcPath = path.join(LOCAL_DATA_DIR, file);
            if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    } catch (err) {
        console.warn("Aviso ao sincronizar /tmp/gramaticalizando_data:", err.message);
    }
}

const UPLOADS_DIR = isVercel ? "/tmp/gramaticalizando_uploads" : path.join(ROOT_DIR, "uploads");
const UPLOADS_PDF_DIR = path.join(UPLOADS_DIR, "pdf");
const UPLOADS_VIDEOS_DIR = path.join(UPLOADS_DIR, "videos");

try {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_PDF_DIR)) fs.mkdirSync(UPLOADS_PDF_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_VIDEOS_DIR)) fs.mkdirSync(UPLOADS_VIDEOS_DIR, { recursive: true });
} catch (err) {
    console.warn("Aviso ao criar diretórios de upload:", err.message);
}

module.exports = {
    ROOT_DIR,
    PUBLIC_DIR,
    DATA_DIR,
    UPLOADS_DIR,
    UPLOADS_PDF_DIR,
    UPLOADS_VIDEOS_DIR,
    USUARIOS: path.join(DATA_DIR, "usuarios.json"),
    MATERIAS: path.join(DATA_DIR, "materias.json"),
    AULAS: path.join(DATA_DIR, "aulas.json"),
    CURSOS: path.join(DATA_DIR, "cursos.json"),
    EXERCICIOS: path.join(DATA_DIR, "exercicios.json"),
    CATEGORIAS: path.join(DATA_DIR, "categorias.json"),
    REDACOES: path.join(DATA_DIR, "redacoes.json"),
    CRONOGRAMAS: path.join(DATA_DIR, "cronogramas.json"),
    SIMULADOS: path.join(DATA_DIR, "simulados.json"),
    DIAGNOSTICO: path.join(DATA_DIR, "diagnostico.json"),
    MATERIAIS_APOIO: path.join(DATA_DIR, "materiais_apoio.json"),
    TEMAS_REDACAO: path.join(DATA_DIR, "temas_redacao.json"),
    VESTIBULAR: path.join(DATA_DIR, "vestibular.json")
};

