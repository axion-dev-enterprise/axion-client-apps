const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { somenteAdmin } = require("../middlewares/auth");

router.get("/dashboard", somenteAdmin, adminController.obterDashboard);
router.get("/alunos", somenteAdmin, adminController.listarAlunos);

module.exports = router;
