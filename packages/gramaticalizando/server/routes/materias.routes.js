const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/materias.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Rotas protegidas para Alunos com plano aprovado ou Professora
router.get("/materias", somentePlanoAprovado, materiasController.listar);
router.get("/materias/:id", somentePlanoAprovado, materiasController.obterPorId);

// Rotas Administrativas
router.get("/admin/materias", somenteAdmin, materiasController.listar);
router.get("/admin/materias/:id", somenteAdmin, materiasController.obterPorId);
router.post("/admin/materias", somenteAdmin, materiasController.criar);
router.put("/admin/materias/:id", somenteAdmin, materiasController.atualizar);
router.delete("/admin/materias/:id", somenteAdmin, materiasController.excluir);

// Aulas dentro da matéria
router.get("/admin/materias/:materiaId/aulas", somenteAdmin, materiasController.listarAulasDaMateria);
router.post("/admin/materias/:materiaId/aulas", somenteAdmin, materiasController.criarAulaNaMateria);

module.exports = router;
