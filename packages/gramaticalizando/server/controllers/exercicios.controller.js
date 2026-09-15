const crypto = require("crypto");
const paths = require("../config/paths");
const {
    lerArquivoJson,
    salvarArquivoJson,
    validarQuestoes,
    limparQuestaoParaAluno,
    corrigirQuestao,
    garantirDadosEstudo
} = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

async function listarAdmin(req, res) {
    try {
        const [exercicios, materias, aulas] = await Promise.all([
            lerArquivoJson(paths.EXERCICIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        const formatados = exercicios.map(ex => {
            const materia = materias.find(m => m.id === ex.materiaId);
            const aula = aulas.find(a => a.id === ex.aulaId);
            return {
                id: ex.id,
                titulo: ex.titulo,
                descricao: ex.descricao,
                publicado: ex.publicado,
                materiaId: ex.materiaId,
                aulaId: ex.aulaId,
                nomeMateria: materia ? materia.nome : "Sem matéria",
                nomeAula: aula ? aula.titulo : "Geral",
                totalQuestoes: Array.isArray(ex.questoes) ? ex.questoes.length : 0,
                criadoEm: ex.criadoEm,
                atualizadoEm: ex.atualizadoEm
            };
        });

        return res.json({ sucesso: true, exercicios: formatados });
    } catch (erro) {
        console.error("Erro listar exercícios admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar exercícios." });
    }
}

async function obterPorIdAdmin(req, res) {
    try {
        const exercicios = await lerArquivoJson(paths.EXERCICIOS);
        const exercicio = exercicios.find(item => item.id === req.params.id);
        if (!exercicio) {
            return res.status(404).json({ sucesso: false, mensagem: "Exercício não encontrado." });
        }
        return res.json({ sucesso: true, exercicio });
    } catch (erro) {
        console.error("Erro buscar exercício admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar exercício." });
    }
}

async function criarAdmin(req, res) {
    try {
        const materiaId = String(req.body.materiaId || "").trim();
        const aulaId = String(req.body.aulaId || "").trim();
        const titulo = String(req.body.titulo || "").trim();
        const descricao = String(req.body.descricao || "").trim();
        const publicado = Boolean(req.body.publicado);

        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido para o exercício." });
        }

        const validacao = validarQuestoes(req.body.questoes);
        if (!validacao.valido) {
            return res.status(400).json({ sucesso: false, mensagem: validacao.mensagem });
        }

        const [exercicios, materias, aulas] = await Promise.all([
            lerArquivoJson(paths.EXERCICIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        if (materiaId) {
            const materiaExiste = materias.some(m => m.id === materiaId);
            if (!materiaExiste) {
                return res.status(400).json({ sucesso: false, mensagem: "Matéria informada não existe." });
            }
        }

        if (aulaId) {
            const aulaExiste = aulas.some(a => a.id === aulaId);
            if (!aulaExiste) {
                return res.status(400).json({ sucesso: false, mensagem: "Aula informada não existe." });
            }
        }

        const agora = new Date().toISOString();
        const novo = {
            id: crypto.randomUUID(),
            materiaId: materiaId || null,
            aulaId: aulaId || null,
            titulo,
            descricao,
            publicado,
            questoes: validacao.questoes,
            criadoEm: agora,
            atualizadoEm: agora
        };

        exercicios.push(novo);
        await salvarArquivoJson(paths.EXERCICIOS, exercicios);

        return res.status(201).json({ sucesso: true, exercicio: novo });
    } catch (erro) {
        console.error("Erro criar exercício admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao criar exercício." });
    }
}

async function atualizarAdmin(req, res) {
    try {
        const materiaId = String(req.body.materiaId || "").trim();
        const aulaId = String(req.body.aulaId || "").trim();
        const titulo = String(req.body.titulo || "").trim();
        const descricao = String(req.body.descricao || "").trim();
        const publicado = Boolean(req.body.publicado);

        if (titulo.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um título válido para o exercício." });
        }

        const validacao = validarQuestoes(req.body.questoes);
        if (!validacao.valido) {
            return res.status(400).json({ sucesso: false, mensagem: validacao.mensagem });
        }

        const [exercicios, materias, aulas] = await Promise.all([
            lerArquivoJson(paths.EXERCICIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        const indice = exercicios.findIndex(item => item.id === req.params.id);
        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Exercício não encontrado." });
        }

        if (materiaId) {
            const materiaExiste = materias.some(m => m.id === materiaId);
            if (!materiaExiste) {
                return res.status(400).json({ sucesso: false, mensagem: "Matéria informada não existe." });
            }
        }

        if (aulaId) {
            const aulaExiste = aulas.some(a => a.id === aulaId);
            if (!aulaExiste) {
                return res.status(400).json({ sucesso: false, mensagem: "Aula informada não existe." });
            }
        }

        exercicios[indice].materiaId = materiaId || null;
        exercicios[indice].aulaId = aulaId || null;
        exercicios[indice].titulo = titulo;
        exercicios[indice].descricao = descricao;
        exercicios[indice].publicado = publicado;
        exercicios[indice].questoes = validacao.questoes;
        exercicios[indice].atualizadoEm = new Date().toISOString();

        await salvarArquivoJson(paths.EXERCICIOS, exercicios);
        return res.json({ sucesso: true, exercicio: exercicios[indice] });
    } catch (erro) {
        console.error("Erro atualizar exercício admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar alterações do exercício." });
    }
}

async function excluirAdmin(req, res) {
    try {
        const exercicios = await lerArquivoJson(paths.EXERCICIOS);
        const indice = exercicios.findIndex(item => item.id === req.params.id);
        if (indice === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Exercício não encontrado." });
        }

        exercicios.splice(indice, 1);
        await salvarArquivoJson(paths.EXERCICIOS, exercicios);

        return res.json({ sucesso: true, mensagem: "Exercício excluído com sucesso." });
    } catch (erro) {
        console.error("Erro excluir exercício admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir exercício." });
    }
}

async function listarAluno(req, res) {
    try {
        const materiaId = String(req.query.materiaId || "").trim();
        const aulaId = String(req.query.aulaId || "").trim();

        const [exercicios, materias, aulas] = await Promise.all([
            lerArquivoJson(paths.EXERCICIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        let publicados = exercicios.filter(item => item.publicado === true);
        if (materiaId) {
            publicados = publicados.filter(item => item.materiaId === materiaId);
        }
        if (aulaId) {
            publicados = publicados.filter(item => item.aulaId === aulaId);
        }

        const formatados = publicados.map(item => {
            const materia = materias.find(m => m.id === item.materiaId);
            const aula = aulas.find(a => a.id === item.aulaId);
            return {
                id: item.id,
                titulo: item.titulo,
                descricao: item.descricao,
                materiaId: item.materiaId,
                aulaId: item.aulaId,
                nomeMateria: materia ? materia.nome : "Geral",
                nomeAula: aula ? aula.titulo : "Geral",
                totalQuestoes: Array.isArray(item.questoes) ? item.questoes.length : 0,
                criadoEm: item.criadoEm
            };
        });

        return res.json({ sucesso: true, exercicios: formatados });
    } catch (erro) {
        console.error("Erro listar exercícios aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar exercícios." });
    }
}

async function obterPorIdAluno(req, res) {
    try {
        const exercicios = await lerArquivoJson(paths.EXERCICIOS);
        const exercicio = exercicios.find(item => item.id === req.params.id && item.publicado === true);

        if (!exercicio) {
            return res.status(404).json({ sucesso: false, mensagem: "Exercício não encontrado ou não publicado." });
        }

        return res.json({
            sucesso: true,
            exercicio: {
                id: exercicio.id,
                materiaId: exercicio.materiaId,
                aulaId: exercicio.aulaId,
                titulo: exercicio.titulo,
                descricao: exercicio.descricao,
                questoes: Array.isArray(exercicio.questoes)
                    ? exercicio.questoes.map(limparQuestaoParaAluno)
                    : []
            }
        });
    } catch (erro) {
        console.error("Erro buscar exercício aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar exercício." });
    }
}

async function finalizarAluno(req, res) {
    try {
        const exercicioId = String(req.params.id || "").trim();
        const user = obterUsuarioAutenticado(req);

        if (!user || !user.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        const respostasRecebidas = Array.isArray(req.body.respostas) ? req.body.respostas : [];

        const [usuarios, exercicios] = await Promise.all([
            lerArquivoJson(paths.USUARIOS),
            lerArquivoJson(paths.EXERCICIOS)
        ]);

        const usuario = usuarios.find(u => u.id === user.id);
        if (!usuario) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
        }

        const exercicio = exercicios.find(e => e.id === exercicioId && e.publicado === true);
        if (!exercicio) {
            return res.status(404).json({ sucesso: false, mensagem: "Exercício não encontrado ou não publicado." });
        }

        const questoes = Array.isArray(exercicio.questoes) ? exercicio.questoes : [];
        let corretas = 0;
        let erradas = 0;
        const detalhesRespostas = [];

        questoes.forEach(questao => {
            const envio = respostasRecebidas.find(r => r.questaoId === questao.id);
            const resultado = corrigirQuestao(questao, envio ? envio.resposta : "");

            if (resultado.correta) {
                corretas += 1;
            } else {
                erradas += 1;
            }

            detalhesRespostas.push({
                questaoId: questao.id,
                tipo: questao.tipo,
                correta: resultado.correta,
                respostaAluno: resultado.respostaAluno,
                respostaCorreta: resultado.respostaCorreta
            });
        });

        const total = questoes.length;
        const porcentagem = total > 0 ? Math.round((corretas / total) * 100) : 0;

        const estudos = garantirDadosEstudo(usuario);
        if (!Array.isArray(estudos.exercicios)) {
            estudos.exercicios = [];
        }

        const registroExercicio = {
            id: crypto.randomUUID(),
            exercicioId: exercicio.id,
            materiaId: exercicio.materiaId,
            aulaId: exercicio.aulaId,
            titulo: exercicio.titulo,
            total,
            corretas,
            erradas,
            porcentagem,
            respostas: detalhesRespostas,
            concluidoEm: new Date().toISOString()
        };

        estudos.exercicios.unshift(registroExercicio);

        if (!Array.isArray(estudos.atividades)) {
            estudos.atividades = [];
        }
        estudos.atividades.unshift({
            id: crypto.randomUUID(),
            tipo: "exercicio",
            titulo: `Exercício concluído: ${exercicio.titulo}`,
            descricao: `${corretas} de ${total} questões corretas (${porcentagem}%).`,
            referenciaId: exercicio.id,
            criadoEm: new Date().toISOString()
        });

        estudos.ultimoAcesso = new Date().toISOString();
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        return res.json({
            sucesso: true,
            resultado: {
                total,
                corretas,
                erradas,
                porcentagem,
                respostas: detalhesRespostas
            }
        });
    } catch (erro) {
        console.error("Erro finalizar exercício aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao finalizar exercício." });
    }
}

module.exports = {
    listarAdmin,
    obterPorIdAdmin,
    criarAdmin,
    atualizarAdmin,
    excluirAdmin,
    listarAluno,
    obterPorIdAluno,
    finalizarAluno
};
