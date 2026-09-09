function somenteAdmin(req, res, next) {
    if (!req.session?.usuario || req.session.usuario.tipo !== "admin") {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Acesso não autorizado."
        });
    }
    next();
}

function protegerPaginaAdmin(req, res, next) {
    if (!req.session?.usuario || req.session.usuario.tipo !== "admin") {
        return res.redirect("/admin-login.html");
    }
    next();
}

function obterUsuarioAutenticado(req) {
    if (req.session?.usuario) {
        return req.session.usuario;
    }
    const fallbackId = req.query.usuarioId || req.body.usuarioId || req.params.id;
    if (fallbackId) {
        return { id: String(fallbackId).trim(), tipo: "aluno" };
    }
    return null;
}

function somenteAluno(req, res, next) {
    const user = obterUsuarioAutenticado(req);
    if (!user || !user.id) {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Acesso não autorizado ou sessão expirada."
        });
    }
    req.usuarioAutenticado = user;
    next();
}

module.exports = {
    somenteAdmin,
    protegerPaginaAdmin,
    obterUsuarioAutenticado,
    somenteAluno
};
