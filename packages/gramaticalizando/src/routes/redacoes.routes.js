const express = require("express");
const router = express.Router();
const redacoesController = require("../controllers/redacoes.controller");
const { somenteAdmin, somenteAluno } = require("../middlewares/auth");

// Aluno
router.get("/aluno/redacoes/temas", redacoesController.obterTemas);
router.get("/aluno/redacoes", somenteAluno, redacoesController.listarAluno);
router.post("/aluno/redacoes", somenteAluno, redacoesController.enviar);

// Admin / Profª Wilma
router.get("/admin/redacoes", somenteAdmin, redacoesController.listarAdmin);
router.put("/admin/redacoes/:id/corrigir", somenteAdmin, redacoesController.corrigir);

module.exports = router;
