const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../../");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

module.exports = {
    ROOT_DIR,
    PUBLIC_DIR,
    USUARIOS: path.join(ROOT_DIR, "usuarios.json"),
    MATERIAS: path.join(ROOT_DIR, "materias.json"),
    AULAS: path.join(ROOT_DIR, "aulas.json"),
    CURSOS: path.join(ROOT_DIR, "cursos.json"),
    EXERCICIOS: path.join(ROOT_DIR, "exercicios.json"),
    CATEGORIAS: path.join(ROOT_DIR, "categorias.json")
};
