const express = require("express");
const router = express.Router();
const diagnosticoController = require("../controllers/diagnostico.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Questões do diagnóstico (exclusivas para alunos com plano aprovado)
router.get("/aluno/diagnostico/questoes", somentePlanoAprovado, diagnosticoController.obterQuestoes);
router.get("/diagnostico/questoes", somentePlanoAprovado, diagnosticoController.obterQuestoes);

// Processar respostas
router.post("/aluno/diagnostico/processar", somentePlanoAprovado, diagnosticoController.processar);
router.post("/diagnostico/processar", somentePlanoAprovado, diagnosticoController.processar);

// Rotas Administrativas (Professor / Admin)
router.get("/admin/diagnostico", somenteAdmin, diagnosticoController.obterDiagnosticoAdmin);
router.post("/admin/diagnostico/questoes", somenteAdmin, diagnosticoController.criarQuestaoAdmin);
router.put("/admin/diagnostico/questoes/:id", somenteAdmin, diagnosticoController.atualizarQuestaoAdmin);
router.delete("/admin/diagnostico/questoes/:id", somenteAdmin, diagnosticoController.excluirQuestaoAdmin);

module.exports = router;
