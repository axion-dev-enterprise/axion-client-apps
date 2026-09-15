const express = require("express");
const router = express.Router();
const exerciciosController = require("../controllers/exercicios.controller");
const { somenteAdmin, somenteAluno } = require("../middlewares/auth");

// Admin
router.get("/admin/exercicios", somenteAdmin, exerciciosController.listarAdmin);
router.get("/admin/exercicios/:id", somenteAdmin, exerciciosController.obterPorIdAdmin);
router.post("/admin/exercicios", somenteAdmin, exerciciosController.criarAdmin);
router.put("/admin/exercicios/:id", somenteAdmin, exerciciosController.atualizarAdmin);
router.delete("/admin/exercicios/:id", somenteAdmin, exerciciosController.excluirAdmin);

// Aluno
router.get("/aluno/exercicios", exerciciosController.listarAluno);
router.get("/aluno/exercicios/:id", exerciciosController.obterPorIdAluno);
router.post("/aluno/exercicios/:id/finalizar", somenteAluno, exerciciosController.finalizarAluno);

module.exports = router;
