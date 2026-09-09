const express = require("express");
const router = express.Router();
const diagnosticoController = require("../controllers/diagnostico.controller");
const { somenteAluno } = require("../middlewares/auth");

// Questões do diagnóstico (públicas para o teste/onboarding)
router.get("/aluno/diagnostico/questoes", diagnosticoController.obterQuestoes);

// Processar respostas e salvar no perfil do aluno autenticado
router.post("/aluno/diagnostico/processar", somenteAluno, diagnosticoController.processar);

module.exports = router;
