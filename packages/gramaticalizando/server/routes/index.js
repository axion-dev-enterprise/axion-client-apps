const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const materiasRoutes = require("./materias.routes");
const aulasRoutes = require("./aulas.routes");
const exerciciosRoutes = require("./exercicios.routes");
const dashboardRoutes = require("./dashboard.routes");
const redacoesRoutes = require("./redacoes.routes");
const diagnosticoRoutes = require("./diagnostico.routes");

router.use(authRoutes);
router.use("/admin", adminRoutes);
router.use(materiasRoutes);
router.use(aulasRoutes);
router.use(exerciciosRoutes);
router.use(dashboardRoutes);
router.use(redacoesRoutes);
router.use(diagnosticoRoutes);

module.exports = router;
