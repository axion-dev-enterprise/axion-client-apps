const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const materiasRoutes = require("./materias.routes");
const aulasRoutes = require("./aulas.routes");
const exerciciosRoutes = require("./exercicios.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use(authRoutes);
router.use("/admin", adminRoutes);
router.use(materiasRoutes);
router.use(aulasRoutes);
router.use(exerciciosRoutes);
router.use(dashboardRoutes);

module.exports = router;
