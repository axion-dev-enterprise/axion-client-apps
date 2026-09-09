const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { somenteAluno } = require("../middlewares/auth");

router.get("/dashboard/me", somenteAluno, dashboardController.obterDashboardAluno);
router.get("/dashboard/:id", somenteAluno, dashboardController.obterDashboardAluno);

module.exports = router;
