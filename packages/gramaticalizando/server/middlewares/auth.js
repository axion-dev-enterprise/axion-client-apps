function somenteAdmin(req, res, next) {
    const usuario = req.session?.usuario;
    if (usuario && (usuario.tipo === "admin" || usuario.perfil === "professor")) {
        req.usuarioAutenticado = usuario;
        return next();
    }

    return res.status(401).json({
        sucesso: false,
        mensagem: "Acesso restrito à administração da Professora Wilma."
    });
}

function protegerPaginaAdmin(req, res, next) {
    const usuario = req.session?.usuario;
    if (!usuario || (usuario.tipo !== "admin" && usuario.perfil !== "professor")) {
        return res.redirect("/login");
    }
    next();
}

function obterUsuarioAutenticado(req) {
    if (req.session?.usuario && req.session.usuario.id) {
        return req.session.usuario;
    }
    return null;
}

function somenteAluno(req, res, next) {
    const user = obterUsuarioAutenticado(req);
    if (!user || !user.id) {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Acesso não autorizado ou sessão expirada. Por favor, faça login."
        });
    }
    req.usuarioAutenticado = user;
    next();
}

const paths = require("../config/paths");

function somentePlanoAprovado(req, res, next) {
    const usuario = req.session?.usuario;
    if (!usuario || !usuario.id) {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Acesso não autorizado ou sessão expirada. Por favor, faça login."
        });
    }

    // Acesso total para administração / Professora Wilma
    if (usuario.tipo === "admin" || usuario.perfil === "professor") {
        req.usuarioAutenticado = usuario;
        return next();
    }

    // Consulta em tempo real para refletir aprovações imediatas da professora
    const { lerArquivoJson } = require("../data/jsonStore");
    lerArquivoJson(paths.USUARIOS)
        .then(usuarios => {
            const aluno = Array.isArray(usuarios) ? usuarios.find(u => u.id === usuario.id) : null;
            const statusAtual = aluno ? (aluno.statusPlano || "pendente") : (usuario.statusPlano || "pendente");

            // Atualiza sessão em tempo real
            req.session.usuario.statusPlano = statusAtual;
            if (aluno?.plano) req.session.usuario.plano = aluno.plano;

            if (statusAtual !== "ativo") {
                return res.status(403).json({
                    sucesso: false,
                    bloqueado: true,
                    motivo: "plano_pendente",
                    statusPlano: statusAtual,
                    codigoReferencia: aluno?.codigoReferencia || usuario.codigoReferencia,
                    mensagem: "Conteúdo exclusivo para alunos com plano ativo. Sua matrícula está aguardando aprovação da Professora Wilma."
                });
            }

            req.usuarioAutenticado = aluno || usuario;
            return next();
        })
        .catch(err => {
            console.error("Erro ao validar status do plano:", err);
            if (usuario.statusPlano !== "ativo") {
                return res.status(403).json({
                    sucesso: false,
                    bloqueado: true,
                    motivo: "plano_pendente",
                    mensagem: "Conteúdo exclusivo para alunos com plano ativo. Sua matrícula está aguardando aprovação da Professora Wilma."
                });
            }
            req.usuarioAutenticado = usuario;
            return next();
        });
}

module.exports = {
    somenteAdmin,
    protegerPaginaAdmin,
    obterUsuarioAutenticado,
    somenteAluno,
    somentePlanoAprovado
};

