const express = require("express");
const router = express.Router();
const simuladosController = require("../controllers/simulados.controller");
const { somenteAdmin } = require("../middlewares/auth");

// Rotas públicas / aluno
router.get("/simulados", simuladosController.listar);
router.get("/aluno/simulados", simuladosController.listar);
router.get("/simulados/:id", simuladosController.obterPorId);
router.get("/aluno/simulados/:id", simuladosController.obterPorId);
router.post("/simulados/:id/finalizar", simuladosController.finalizarSimulado);
router.post("/aluno/simulados/:id/finalizar", simuladosController.finalizarSimulado);

// Rotas administrativas (Professor)
router.get("/admin/simulados", somenteAdmin, simuladosController.listarAdmin);
router.get("/admin/simulados/:id", somenteAdmin, simuladosController.obterPorId);
router.post("/admin/simulados", somenteAdmin, simuladosController.criarAdmin);
router.put("/admin/simulados/:id", somenteAdmin, simuladosController.atualizarAdmin);
router.delete("/admin/simulados/:id", somenteAdmin, simuladosController.excluirAdmin);

module.exports = router;
