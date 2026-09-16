const express = require("express");
const router = express.Router();
const exerciciosController = require("../controllers/exercicios.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Admin
router.get("/admin/exercicios", somenteAdmin, exerciciosController.listarAdmin);
router.get("/admin/exercicios/:id", somenteAdmin, exerciciosController.obterPorIdAdmin);
router.post("/admin/exercicios", somenteAdmin, exerciciosController.criarAdmin);
router.put("/admin/exercicios/:id", somenteAdmin, exerciciosController.atualizarAdmin);
router.delete("/admin/exercicios/:id", somenteAdmin, exerciciosController.excluirAdmin);

// Aluno com Plano Aprovado
router.get("/aluno/exercicios", somentePlanoAprovado, exerciciosController.listarAluno);
router.get("/exercicios", somentePlanoAprovado, exerciciosController.listarAluno);
router.get("/aluno/exercicios/:id", somentePlanoAprovado, exerciciosController.obterPorIdAluno);
router.get("/exercicios/:id", somentePlanoAprovado, exerciciosController.obterPorIdAluno);
router.post("/aluno/exercicios/:id/finalizar", somentePlanoAprovado, exerciciosController.finalizarAluno);

module.exports = router;
