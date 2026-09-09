const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/materias.controller");
const { somenteAdmin } = require("../middlewares/auth");

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
