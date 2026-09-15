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
