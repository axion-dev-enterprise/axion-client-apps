const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

async function obterPorIdAdmin(req, res) {
    try {
        const [aulas, materias] = await Promise.all([
            lerArquivoJson(paths.AULAS),
            lerArquivoJson(paths.MATERIAS)
        ]);

        const aula = aulas.find(item => item.id === req.params.id);
        if (!aula) {
            return res.status(404).json({ sucesso: false, mensagem: "Aula não encontrada." });
        }

        const materia = materias.find(item => item.id === aula.materiaId);
        return res.json({ sucesso: true, aula, materia: materia || null });
    } catch (erro) {
        console.error("Erro buscar aula admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar aula." });
    }
}

async function atualizarAdmin(req, res) {
    try {
        const titulo = String(req.body.titulo || "").trim();
        const conteudo = String(req.body.conteudo || "");
        const videoUrl = String(req.body.videoUrl || "").trim();
        const materialPdfUrl = String(req.body.materialPdfUrl || "").trim();
        const publicado = Boolean(req.body.publicado);

        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido para a aula." });
        }

        const aulas = await lerArquivoJson(paths.AULAS);
        const indice = aulas.findIndex(item => item.id === req.params.id);
        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Aula não encontrada." });
        }

        aulas[indice].titulo = titulo;
        aulas[indice].conteudo = conteudo;
        aulas[indice].videoUrl = videoUrl || null;
        aulas[indice].materialPdfUrl = materialPdfUrl || null;
        aulas[indice].publicado = publicado;
        aulas[indice].atualizadoEm = new Date().toISOString();

        await salvarArquivoJson(paths.AULAS, aulas);
        return res.json({ sucesso: true, aula: aulas[indice] });
    } catch (erro) {
        console.error("Erro atualizar aula admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar alterações da aula." });
    }
}

async function excluirAdmin(req, res) {
    try {
        const aulaId = req.params.id;
        const [aulas, exercicios] = await Promise.all([
            lerArquivoJson(paths.AULAS),
            lerArquivoJson(paths.EXERCICIOS)
        ]);

        const indice = aulas.findIndex(item => item.id === aulaId);
        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Aula não encontrada." });
        }

        aulas.splice(indice, 1);
        const exerciciosRestantes = exercicios.filter(item => item.aulaId !== aulaId);

        await Promise.all([
            salvarArquivoJson(paths.AULAS, aulas),
            salvarArquivoJson(paths.EXERCICIOS, exerciciosRestantes)
        ]);

        return res.json({ sucesso: true, mensagem: "Aula excluída com sucesso." });
    } catch (erro) {
        console.error("Erro excluir aula admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir aula." });
    }
}

async function obterAulaAluno(req, res) {
    try {
        const aulaId = String(req.params.id || "").trim();
        const user = obterUsuarioAutenticado(req);

        if (!user || !user.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        const [usuarios, materias, aulas, exercicios] = await Promise.all([
            lerArquivoJson(paths.USUARIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS),
            lerArquivoJson(paths.EXERCICIOS)
        ]);

        const usuario = usuarios.find(u => u.id === user.id);
        const aula = aulas.find(item => item.id === aulaId && item.publicado === true);

        if (!aula) {
            return res.status(404).json({ sucesso: false, mensagem: "Aula não encontrada ou não publicada." });
        }

        const materia = materias.find(item => item.id === aula.materiaId);
        const aulasDaMateria = aulas
            .filter(item => item.materiaId === aula.materiaId && item.publicado === true)
            .sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));

        const indiceAtual = aulasDaMateria.findIndex(item => item.id === aula.id);
        const aulaAnterior = indiceAtual > 0 ? aulasDaMateria[indiceAtual - 1] : null;
        const proximaAula = indiceAtual !== -1 && indiceAtual < aulasDaMateria.length - 1
            ? aulasDaMateria[indiceAtual + 1]
            : null;

        const exerciciosVinculados = exercicios
            .filter(item => item.aulaId === aula.id && item.publicado === true)
            .map(item => ({
                id: item.id,
                titulo: item.titulo,
                descricao: item.descricao,
                totalQuestoes: Array.isArray(item.questoes) ? item.questoes.length : 0
            }));

        const estudos = usuario ? garantirDadosEstudo(usuario) : { aulasConcluidas: [] };
        const concluida = Array.isArray(estudos.aulasConcluidas) && estudos.aulasConcluidas.includes(aula.id);

        return res.json({
            sucesso: true,
            aula: {
                id: aula.id,
                titulo: aula.titulo,
                conteudo: aula.conteudo,
                videoUrl: aula.videoUrl || null,
                materialPdfUrl: aula.materialPdfUrl || null,
                materiaId: aula.materiaId,
                criadoEm: aula.criadoEm,
                atualizadoEm: aula.atualizadoEm,
                concluida
            },
            materia: materia ? { id: materia.id, nome: materia.nome } : null,
            navegacao: {
                anterior: aulaAnterior ? { id: aulaAnterior.id, titulo: aulaAnterior.titulo } : null,
                proxima: proximaAula ? { id: proximaAula.id, titulo: proximaAula.titulo } : null,
                total: aulasDaMateria.length,
                atual: indiceAtual + 1
            },
            exercicios: exerciciosVinculados
        });
    } catch (erro) {
        console.error("Erro abrir aula aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar aula." });
    }
}

async function concluirAulaAluno(req, res) {
    try {
        const aulaId = String(req.params.id || "").trim();
        const user = obterUsuarioAutenticado(req);

        if (!user || !user.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        const [usuarios, aulas] = await Promise.all([
            lerArquivoJson(paths.USUARIOS),
            lerArquivoJson(paths.AULAS)
        ]);

        const usuario = usuarios.find(u => u.id === user.id);
        if (!usuario) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
        }

        const aula = aulas.find(item => item.id === aulaId && item.publicado === true);
        if (!aula) {
            return res.status(404).json({ sucesso: false, mensagem: "Aula não encontrada ou não publicada." });
        }

        const estudos = garantirDadosEstudo(usuario);
        if (!Array.isArray(estudos.aulasConcluidas)) {
            estudos.aulasConcluidas = [];
        }

        const jaConcluida = estudos.aulasConcluidas.includes(aula.id);
        if (!jaConcluida) {
            estudos.aulasConcluidas.push(aula.id);
            if (!Array.isArray(estudos.atividades)) {
                estudos.atividades = [];
            }
            estudos.atividades.unshift({
                id: crypto.randomUUID(),
                tipo: "aula",
                titulo: `Aula concluída: ${aula.titulo}`,
                descricao: "Você concluiu esta aula com sucesso.",
                referenciaId: aula.id,
                criadoEm: new Date().toISOString()
            });
        }

        estudos.ultimoAcesso = new Date().toISOString();
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        return res.json({
            sucesso: true,
            mensagem: jaConcluida ? "Aula já estava concluída." : "Aula concluída com sucesso!",
            concluida: true,
            totalAulasConcluidas: estudos.aulasConcluidas.length
        });
    } catch (erro) {
        console.error("Erro concluir aula aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao concluir a aula." });
    }
}

module.exports = {
    obterPorIdAdmin,
    atualizarAdmin,
    excluirAdmin,
    obterAulaAluno,
    concluirAulaAluno
};
