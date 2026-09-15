const express = require("express");
const router = express.Router();
const materiaisController = require("../controllers/materiais_apoio.controller");
const { somenteAdmin } = require("../middlewares/auth");

// Aluno / Público
router.get("/materiais-apoio", materiaisController.listar);
router.get("/aluno/materiais-apoio", materiaisController.listar);

// Admin / Professor
router.get("/admin/materiais-apoio", somenteAdmin, materiaisController.listarAdmin);
router.post("/admin/materiais-apoio", somenteAdmin, materiaisController.criarAdmin);
router.put("/admin/materiais-apoio/:id", somenteAdmin, materiaisController.atualizarAdmin);
router.delete("/admin/materiais-apoio/:id", somenteAdmin, materiaisController.excluirAdmin);

module.exports = router;
