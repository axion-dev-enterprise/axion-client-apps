const express = require("express");
const router = express.Router();
const vestibularController = require("../controllers/vestibular.controller");
const { somenteAdmin, somenteAluno } = require("../middlewares/auth");

// Aluno & Público
router.get("/vestibular/conteudo", vestibularController.obterConteudoVestibular);
router.get("/aluno/vestibular/redacoes", somenteAluno, vestibularController.listarRedacoesAluno);
router.post("/aluno/vestibular/redacoes", somenteAluno, vestibularController.enviarRedacaoAluno);

// Admin / Profª Wilma
router.get("/admin/vestibular", somenteAdmin, vestibularController.listarAdmin);
router.post("/admin/vestibular/videoaulas", somenteAdmin, vestibularController.criarVideoaulaAdmin);
router.put("/admin/vestibular/videoaulas/:id", somenteAdmin, vestibularController.atualizarVideoaulaAdmin);
router.delete("/admin/vestibular/videoaulas/:id", somenteAdmin, vestibularController.excluirVideoaulaAdmin);

router.post("/admin/vestibular/temas", somenteAdmin, vestibularController.criarTemaAdmin);
router.put("/admin/vestibular/temas/:id", somenteAdmin, vestibularController.atualizarTemaAdmin);
router.delete("/admin/vestibular/temas/:id", somenteAdmin, vestibularController.excluirTemaAdmin);

router.put("/admin/vestibular/redacoes/:id/corrigir", somenteAdmin, vestibularController.corrigirRedacaoAdmin);

module.exports = router;
