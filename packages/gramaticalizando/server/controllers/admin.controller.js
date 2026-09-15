const paths = require("../config/paths");
const { lerArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");

async function obterDashboard(req, res) {
    try {
        const [usuarios, materias, aulas, exercicios] = await Promise.all([
            lerArquivoJson(paths.USUARIOS),
            lerArquivoJson(paths.MATERIAS),
            lerArquivoJson(paths.AULAS),
            lerArquivoJson(paths.EXERCICIOS)
        ]);

        const alunos = usuarios.filter(u => u.tipo !== "admin");

        let totalQuestoesFeitas = 0;
        let totalQuestoesAcertadas = 0;

        alunos.forEach(aluno => {
            const estudos = garantirDadosEstudo(aluno);
            (estudos.exercicios || []).forEach(ex => {
                totalQuestoesFeitas += Number(ex.total || 0);
                totalQuestoesAcertadas += Number(ex.corretas || 0);
            });
        });

        const taxaAcertoGeral = totalQuestoesFeitas > 0
            ? Math.round((totalQuestoesAcertadas / totalQuestoesFeitas) * 100)
            : 0;

        return res.json({
            sucesso: true,
            dashboard: {
                totalAlunos: alunos.length,
                totalMaterias: materias.length,
                totalAulas: aulas.length,
                totalExercicios: exercicios.length,
                taxaAcertoGeral
            }
        });
    } catch (erro) {
        console.error("Erro ao carregar dashboard admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar dashboard." });
    }
}

async function listarAlunos(req, res) {
    try {
        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const alunos = usuarios
            .filter(usuario => usuario.tipo !== "admin")
            .map(usuario => {
                const estudos = garantirDadosEstudo(usuario);
                let questoesFeitas = 0;
                let questoesAcertadas = 0;

                (estudos.exercicios || []).forEach(ex => {
                    questoesFeitas += Number(ex.total || 0);
                    questoesAcertadas += Number(ex.corretas || 0);
                });

                const taxa = questoesFeitas > 0
                    ? Math.round((questoesAcertadas / questoesFeitas) * 100)
                    : 0;

                return {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    criadoEm: usuario.criadoEm,
                    aulasConcluidas: (estudos.aulasConcluidas || []).length,
                    exerciciosConcluidos: (estudos.exercicios || []).length,
                    taxaAcerto: taxa,
                    ultimoAcesso: estudos.ultimoAcesso
                };
            });

        return res.json({ sucesso: true, alunos });
    } catch (erro) {
        console.error("Erro ao listar alunos admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar alunos." });
    }
}

module.exports = {
    obterDashboard,
    listarAlunos
};
