const path = require("path");
const fs = require("fs");

const ROOT_DIR = path.resolve(__dirname, "../../");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? "/tmp/gramaticalizando_data" : ROOT_DIR;

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
            "redacoes.json"
        ];
        for (const file of jsonFiles) {
            const destPath = path.join(DATA_DIR, file);
            const srcPath = path.join(ROOT_DIR, file);
            if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    } catch (err) {
        console.warn("Aviso ao sincronizar /tmp/gramaticalizando_data:", err.message);
    }
}

module.exports = {
    ROOT_DIR,
    PUBLIC_DIR,
    DATA_DIR,
    USUARIOS: path.join(DATA_DIR, "usuarios.json"),
    MATERIAS: path.join(DATA_DIR, "materias.json"),
    AULAS: path.join(DATA_DIR, "aulas.json"),
    CURSOS: path.join(DATA_DIR, "cursos.json"),
    EXERCICIOS: path.join(DATA_DIR, "exercicios.json"),
    CATEGORIAS: path.join(DATA_DIR, "categorias.json"),
    REDACOES: path.join(DATA_DIR, "redacoes.json")
};
