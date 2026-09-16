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
                    plano: usuario.plano || 'medio',
                    statusPlano: usuario.statusPlano || 'ativo',
                    codigoReferencia: usuario.codigoReferencia || `GRAM-${String(usuario.id).replace(/\D/g, '').slice(0, 4) || '1001'}`,
                    dataSolicitacaoPlano: usuario.dataSolicitacaoPlano || usuario.criadoEm,
                    dataAprovacaoPlano: usuario.dataAprovacaoPlano || null,
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

async function aprovarPlanoAluno(req, res) {
    try {
        const alunoId = req.params.id;
        const { plano } = req.body;

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const idx = usuarios.findIndex(u => u.id === alunoId);

        if (idx === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Aluno não encontrado." });
        }

        if (plano && ['iniciante', 'medio', 'pro'].includes(String(plano).toLowerCase())) {
            usuarios[idx].plano = String(plano).toLowerCase();
        }

        usuarios[idx].statusPlano = "ativo";
        usuarios[idx].dataAprovacaoPlano = new Date().toISOString();

        const { salvarArquivoJson } = require("../data/jsonStore");
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        return res.json({
            sucesso: true,
            mensagem: `Plano do aluno ${usuarios[idx].nome} aprovado com sucesso!`,
            aluno: {
                id: usuarios[idx].id,
                nome: usuarios[idx].nome,
                email: usuarios[idx].email,
                plano: usuarios[idx].plano,
                statusPlano: usuarios[idx].statusPlano,
                codigoReferencia: usuarios[idx].codigoReferencia
            }
        });
    } catch (erro) {
        console.error("Erro ao aprovar plano do aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao aprovar plano do aluno." });
    }
}

async function atualizarStatusPlanoAluno(req, res) {
    try {
        const alunoId = req.params.id;
        const { statusPlano, plano } = req.body;

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const idx = usuarios.findIndex(u => u.id === alunoId);

        if (idx === -1) {
            return res.status(404).json({ sucesso: false, mensagem: "Aluno não encontrado." });
        }

        if (statusPlano && ['pendente', 'ativo', 'recusado'].includes(statusPlano)) {
            usuarios[idx].statusPlano = statusPlano;
            if (statusPlano === 'ativo') {
                usuarios[idx].dataAprovacaoPlano = new Date().toISOString();
            }
        }

        if (plano && ['iniciante', 'medio', 'pro'].includes(String(plano).toLowerCase())) {
            usuarios[idx].plano = String(plano).toLowerCase();
        }

        const { salvarArquivoJson } = require("../data/jsonStore");
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        return res.json({
            sucesso: true,
            mensagem: "Status do plano atualizado com sucesso.",
            aluno: {
                id: usuarios[idx].id,
                nome: usuarios[idx].nome,
                plano: usuarios[idx].plano,
                statusPlano: usuarios[idx].statusPlano
            }
        });
    } catch (erro) {
        console.error("Erro ao atualizar status do plano:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar status do plano." });
    }
}

module.exports = {
    obterDashboard,
    listarAlunos,
    aprovarPlanoAluno,
    atualizarStatusPlanoAluno
};
