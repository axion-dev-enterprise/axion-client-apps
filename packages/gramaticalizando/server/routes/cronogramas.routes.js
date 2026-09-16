const express = require("express");
const router = express.Router();
const cronogramasController = require("../controllers/cronogramas.controller");
const { somenteAluno, somenteAdmin } = require("../middlewares/auth");

// Aluno
router.get("/aluno/cronograma", somenteAluno, cronogramasController.obterCronogramaAluno);
router.post("/aluno/cronograma/toggle", somenteAluno, cronogramasController.toggleItemCronograma);

// Admin / Professor
router.get("/admin/cronogramas", somenteAdmin, cronogramasController.listarAdmin);
router.post("/admin/cronogramas", somenteAdmin, cronogramasController.criarAdmin);
router.put("/admin/cronogramas/:id", somenteAdmin, cronogramasController.atualizarAdmin);
router.delete("/admin/cronogramas/:id", somenteAdmin, cronogramasController.excluirAdmin);

module.exports = router;
