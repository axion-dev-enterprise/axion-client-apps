const paths = require("../config/paths");
const { lerArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");
const { obterUsuarioAutenticado } = require("../middlewares/auth");

async function obterDashboardAluno(req, res) {
    try {
        const user = obterUsuarioAutenticado(req);
        if (!user || !user.id) {
            return res.status(401).json({ sucesso: false, mensagem: "Usuário não autenticado." });
        }

        const [usuarios, materias, aulas] = await Promise.all([
            lerArquivoJson(paths.USUARIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS)
        ]);

        const usuario = usuarios.find(u => u.id === user.id);
        if (!usuario) {
            return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
        }

        const estudos = garantirDadosEstudo(usuario);

        let totalQuestoes = 0;
        let totalCorretas = 0;

        (estudos.exercicios || []).forEach(item => {
            totalQuestoes += Number(item.total || 0);
            totalCorretas += Number(item.corretas || 0);
        });

        const taxaAcerto = totalQuestoes > 0
            ? Math.round((totalCorretas / totalQuestoes) * 100)
            : 0;

        const cursosDisponiveis = materias
            .map(materia => {
                const aulasPublicadas = aulas.filter(
                    aula => aula.materiaId === materia.id && aula.publicado === true
                );

                if (!aulasPublicadas.length) {
                    return null;
                }

                const concluidasDaMateria = aulasPublicadas.filter(
                    aula => (estudos.aulasConcluidas || []).includes(aula.id)
                ).length;

                const progresso = Math.round(
                    (concluidasDaMateria / aulasPublicadas.length) * 100
                );

                return {
                    id: materia.id,
                    nome: materia.nome,
                    totalAulas: aulasPublicadas.length,
                    aulasConcluidas: concluidasDaMateria,
                    progresso,
                    aulas: aulasPublicadas.map(aula => ({
                        id: aula.id,
                        titulo: aula.titulo,
                        conteudo: aula.conteudo,
                        criadoEm: aula.criadoEm,
                        atualizadoEm: aula.atualizadoEm,
                        concluida: (estudos.aulasConcluidas || []).includes(aula.id)
                    }))
                };
            })
            .filter(Boolean);

        return res.json({
            sucesso: true,
            dashboard: {
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                },
                estatisticas: {
                    aulasConcluidas: (estudos.aulasConcluidas || []).length,
                    exerciciosFeitos: (estudos.exercicios || []).length,
                    taxaAcerto,
                    trilhasAtivas: (estudos.trilhasAtivas || []).length,
                    sequencia: Number(estudos.sequencia || 0)
                },
                cursos: cursosDisponiveis,
                atividades: (estudos.atividades || []).slice(-5).reverse()
            }
        });
    } catch (erro) {
        console.error("Erro dashboard aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar dashboard." });
    }
}

module.exports = {
    obterDashboardAluno
};
