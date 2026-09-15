const express = require("express");
const router = express.Router();
const aulasController = require("../controllers/aulas.controller");
const { somenteAdmin, somenteAluno } = require("../middlewares/auth");

// Admin
router.get("/admin/aulas/:id", somenteAdmin, aulasController.obterPorIdAdmin);
router.put("/admin/aulas/:id", somenteAdmin, aulasController.atualizarAdmin);
router.delete("/admin/aulas/:id", somenteAdmin, aulasController.excluirAdmin);

// Aluno
router.get("/aluno/aulas/:id", somenteAluno, aulasController.obterAulaAluno);
router.post("/aluno/aulas/:id/concluir", somenteAluno, aulasController.concluirAulaAluno);

module.exports = router;
