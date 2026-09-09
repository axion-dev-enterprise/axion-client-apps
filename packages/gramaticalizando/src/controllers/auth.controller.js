const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const paths = require("../config/paths");
const { lerArquivoJson, salvarArquivoJson, garantirDadosEstudo } = require("../data/jsonStore");

async function registro(req, res) {
    try {
        const nome = String(req.body.nome || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const senha = String(req.body.senha || "");

        if (nome.length < 2) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um nome válido." });
        }
        if (!email || !email.includes("@")) {
            return res.status(400).json({ sucesso: false, mensagem: "Digite um e-mail válido." });
        }
        if (senha.length < 6) {
            return res.status(400).json({ sucesso: false, mensagem: "A senha precisa ter pelo menos 6 caracteres." });
        }

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const existente = usuarios.find(u => String(u.email).toLowerCase() === email);

        if (existente) {
            return res.status(400).json({ sucesso: false, mensagem: "Já existe uma conta com esse e-mail." });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = {
            id: crypto.randomUUID(),
            nome,
            email,
            senha: senhaHash,
            tipo: "aluno",
            criadoEm: new Date().toISOString()
        };

        garantirDadosEstudo(novoUsuario);
        usuarios.push(novoUsuario);
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        // Estabelece sessão segura automaticamente no cadastro
        req.session.usuario = {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            tipo: "aluno"
        };

        return res.json({
            sucesso: true,
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });
    } catch (erro) {
        console.error("Erro no registro:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro ao registrar usuário." });
    }
}

async function login(req, res) {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const senha = String(req.body.senha || "");

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const usuario = usuarios.find(item =>
            item.tipo !== "admin" &&
            String(item.email).toLowerCase() === email
        );

        if (!usuario) {
            return res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos." });
        }

        const estudos = garantirDadosEstudo(usuario);
        estudos.ultimoAcesso = new Date().toISOString();
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        // PERSISTÊNCIA DA SESSÃO SEGURA DO ALUNO
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: "aluno"
        };

        return res.json({
            sucesso: true,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (erro) {
        console.error("Erro login aluno:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
    }
}

async function adminLogin(req, res) {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const senha = String(req.body.senha || "");

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const admin = usuarios.find(usuario =>
            usuario.tipo === "admin" &&
            String(usuario.email).toLowerCase() === email
        );

        if (!admin) {
            return res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos." });
        }

        const senhaCorreta = await bcrypt.compare(senha, admin.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos." });
        }

        req.session.usuario = {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            tipo: "admin"
        };

        return res.json({
            sucesso: true,
            usuario: {
                id: admin.id,
                nome: admin.nome,
                email: admin.email,
                tipo: "admin"
            }
        });
    } catch (erro) {
        console.error("Erro login admin:", erro);
        return res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
    }
}

function adminMe(req, res) {
    if (!req.session?.usuario || req.session.usuario.tipo !== "admin") {
        return res.status(401).json({ sucesso: false, mensagem: "Não autenticado." });
    }
    return res.json({ sucesso: true, usuario: req.session.usuario });
}

function alunoMe(req, res) {
    if (!req.session?.usuario) {
        return res.status(401).json({ sucesso: false, mensagem: "Não autenticado." });
    }
    return res.json({ sucesso: true, usuario: req.session.usuario });
}

function logout(req, res) {
    req.session.destroy(erro => {
        if (erro) {
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao encerrar sessão." });
        }
        res.clearCookie("connect.sid");
        return res.json({ sucesso: true, mensagem: "Sessão encerrada com sucesso." });
    });
}

module.exports = {
    registro,
    login,
    adminLogin,
    adminMe,
    alunoMe,
    logout
};
