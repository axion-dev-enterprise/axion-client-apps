const express = require("express");
const router = express.Router();
const redacoesController = require("../controllers/redacoes.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Aluno com Plano Aprovado
router.get("/aluno/redacoes/temas", somentePlanoAprovado, redacoesController.obterTemas);
router.get("/aluno/redacoes", somentePlanoAprovado, redacoesController.listarAluno);
router.post("/aluno/redacoes", somentePlanoAprovado, redacoesController.enviar);

// Admin / Profª Wilma
router.get("/admin/redacoes", somenteAdmin, redacoesController.listarAdmin);
router.put("/admin/redacoes/:id/corrigir", somenteAdmin, redacoesController.corrigir);
router.get("/admin/redacoes/temas", somenteAdmin, redacoesController.listarTemasAdmin);
router.post("/admin/redacoes/temas", somenteAdmin, redacoesController.criarTemaAdmin);
router.put("/admin/redacoes/temas/:id", somenteAdmin, redacoesController.atualizarTemaAdmin);
router.delete("/admin/redacoes/temas/:id", somenteAdmin, redacoesController.excluirTemaAdmin);

module.exports = router;
