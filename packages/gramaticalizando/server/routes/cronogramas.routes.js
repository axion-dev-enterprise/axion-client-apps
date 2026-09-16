const express = require("express");
const router = express.Router();
const cronogramasController = require("../controllers/cronogramas.controller");
const { somenteAdmin, somentePlanoAprovado } = require("../middlewares/auth");

// Aluno com Plano Aprovado
router.get("/aluno/cronograma", somentePlanoAprovado, cronogramasController.obterCronogramaAluno);
router.post("/aluno/cronograma/toggle", somentePlanoAprovado, cronogramasController.toggleItemCronograma);

// Admin / Professor
router.get("/admin/cronogramas", somenteAdmin, cronogramasController.listarAdmin);
router.post("/admin/cronogramas", somenteAdmin, cronogramasController.criarAdmin);
router.put("/admin/cronogramas/:id", somenteAdmin, cronogramasController.atualizarAdmin);
router.delete("/admin/cronogramas/:id", somenteAdmin, cronogramasController.excluirAdmin);

module.exports = router;
