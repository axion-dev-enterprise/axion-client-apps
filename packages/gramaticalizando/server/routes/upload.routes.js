const express = require("express");
const router = express.Router();
const { uploadBase64, uploadStream } = require("../controllers/upload.controller");
const { protegerRotaApi } = require("../middlewares/auth");

// Endpoint de upload JSON / Base64
router.post("/upload", protegerRotaApi, uploadBase64);

// Endpoint de upload por Stream (para vídeos pesados e PDFs grandes sem limite de memória)
router.post("/upload/stream", protegerRotaApi, uploadStream);

module.exports = router;
