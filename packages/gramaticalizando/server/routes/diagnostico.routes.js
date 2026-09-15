const express = require("express");
const router = express.Router();
const diagnosticoController = require("../controllers/diagnostico.controller");
const { somenteAluno, somenteAdmin } = require("../middlewares/auth");

// Questões do diagnóstico (públicas para o teste/onboarding)
router.get("/aluno/diagnostico/questoes", diagnosticoController.obterQuestoes);
router.get("/diagnostico/questoes", diagnosticoController.obterQuestoes);

// Processar respostas (público para teste inicial e com salvamento automático se autenticado)
router.post("/aluno/diagnostico/processar", somenteAluno, diagnosticoController.processar);
router.post("/diagnostico/processar", diagnosticoController.processar);

// Rotas Administrativas (Professor / Admin)
router.get("/admin/diagnostico", somenteAdmin, diagnosticoController.obterDiagnosticoAdmin);
router.post("/admin/diagnostico/questoes", somenteAdmin, diagnosticoController.criarQuestaoAdmin);
router.put("/admin/diagnostico/questoes/:id", somenteAdmin, diagnosticoController.atualizarQuestaoAdmin);
router.delete("/admin/diagnostico/questoes/:id", somenteAdmin, diagnosticoController.excluirQuestaoAdmin);

module.exports = router;
