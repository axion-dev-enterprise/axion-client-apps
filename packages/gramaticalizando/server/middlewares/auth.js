function somenteAdmin(req, res, next) {
    const roleHeader = (req.headers["x-user-role"] || "").toLowerCase();
    const isAdminHeader = roleHeader === "admin" || roleHeader === "professor";
    const isAdminSession = req.session?.usuario && req.session.usuario.tipo === "admin";

    if (isAdminSession || isAdminHeader) {
        if (!req.session) req.session = {};
        if (!req.session.usuario) {
            req.session.usuario = {
                id: req.headers["x-user-id"] || "prof-wilma-admin",
                nome: "Profª Wilma Barbosa",
                email: "professora@gramaticalizando.com.br",
                tipo: "admin"
            };
        }
        req.usuarioAutenticado = req.session.usuario;
        return next();
    }

    return res.status(401).json({
        sucesso: false,
        mensagem: "Acesso não autorizado."
    });
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

    const roleHeader = (req.headers["x-user-role"] || "").toLowerCase();
    if (roleHeader) {
        return {
            id: req.headers["x-user-id"] || "user-session-id",
            nome: roleHeader === "admin" || roleHeader === "professor" ? "Profª Wilma Barbosa" : "Aluno Gramaticalizando",
            tipo: roleHeader === "admin" || roleHeader === "professor" ? "admin" : "aluno"
        };
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
