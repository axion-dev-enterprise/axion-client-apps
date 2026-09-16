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

module.exports = {
    somenteAdmin,
    protegerPaginaAdmin,
    obterUsuarioAutenticado,
    somenteAluno
};
