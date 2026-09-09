const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/registro", authController.registro);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);
router.get("/admin/me", authController.adminMe);
router.get("/me", authController.alunoMe);
router.post("/logout", authController.logout);
router.post("/admin/logout", authController.logout);

module.exports = router;
