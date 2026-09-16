const express = require("express");
const router = express.Router();
const aulasController = require("../controllers/aulas.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Admin
router.get("/admin/aulas", somenteAdmin, aulasController.listarAdmin);
router.post("/admin/aulas", somenteAdmin, aulasController.criarAdmin);
router.get("/admin/aulas/:id", somenteAdmin, aulasController.obterPorIdAdmin);
router.put("/admin/aulas/:id", somenteAdmin, aulasController.atualizarAdmin);
router.delete("/admin/aulas/:id", somenteAdmin, aulasController.excluirAdmin);

// Aluno com Plano Aprovado
router.get("/aluno/aulas/:id", somentePlanoAprovado, aulasController.obterAulaAluno);
router.post("/aluno/aulas/:id/concluir", somentePlanoAprovado, aulasController.concluirAulaAluno);

module.exports = router;
