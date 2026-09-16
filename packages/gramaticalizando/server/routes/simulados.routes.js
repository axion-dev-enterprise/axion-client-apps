const express = require("express");
const router = express.Router();
const simuladosController = require("../controllers/simulados.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Rotas protegidas para aluno com plano aprovado
router.get("/simulados", somentePlanoAprovado, simuladosController.listar);
router.get("/aluno/simulados", somentePlanoAprovado, simuladosController.listar);
router.get("/simulados/:id", somentePlanoAprovado, simuladosController.obterPorId);
router.get("/aluno/simulados/:id", somentePlanoAprovado, simuladosController.obterPorId);
router.post("/simulados/:id/finalizar", somentePlanoAprovado, simuladosController.finalizarSimulado);
router.post("/aluno/simulados/:id/finalizar", somentePlanoAprovado, simuladosController.finalizarSimulado);

// Rotas administrativas (Professor)
router.get("/admin/simulados", somenteAdmin, simuladosController.listarAdmin);
router.get("/admin/simulados/:id", somenteAdmin, simuladosController.obterPorId);
router.post("/admin/simulados", somenteAdmin, simuladosController.criarAdmin);
router.put("/admin/simulados/:id", somenteAdmin, simuladosController.atualizarAdmin);
router.delete("/admin/simulados/:id", somenteAdmin, simuladosController.excluirAdmin);

module.exports = router;
