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
        const plano = ['iniciante', 'medio', 'pro'].includes(String(req.body.plano || '').toLowerCase())
            ? String(req.body.plano).toLowerCase()
            : 'medio';

        // Gera código de referência legível de 4 dígitos, ex: GRAM-7429
        const randSufixo = Math.floor(1000 + Math.random() * 9000);
        const codigoReferencia = `GRAM-${randSufixo}`;

        const novoUsuario = {
            id: crypto.randomUUID(),
            nome,
            email,
            senha: senhaHash,
            tipo: "aluno",
            plano,
            statusPlano: "pendente",
            codigoReferencia,
            dataSolicitacaoPlano: new Date().toISOString(),
            dataAprovacaoPlano: null,
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
            tipo: "aluno",
            plano: novoUsuario.plano,
            statusPlano: novoUsuario.statusPlano,
            codigoReferencia: novoUsuario.codigoReferencia
        };

        return res.json({
            sucesso: true,
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                plano: novoUsuario.plano,
                statusPlano: novoUsuario.statusPlano,
                codigoReferencia: novoUsuario.codigoReferencia
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
            tipo: "aluno",
            plano: usuario.plano || "medio",
            statusPlano: usuario.statusPlano || "ativo",
            codigoReferencia: usuario.codigoReferencia || `GRAM-${String(usuario.id).replace(/\D/g, '').slice(0, 4) || '1001'}`
        };

        return res.json({
            sucesso: true,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                plano: req.session.usuario.plano,
                statusPlano: req.session.usuario.statusPlano,
                codigoReferencia: req.session.usuario.codigoReferencia
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

async function alunoMe(req, res) {
    if (!req.session?.usuario) {
        return res.status(401).json({ sucesso: false, mensagem: "Não autenticado." });
    }

    try {
        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const atual = usuarios.find(u => u.id === req.session.usuario.id);
        if (atual) {
            const plano = atual.plano || "medio";
            const statusPlano = atual.statusPlano || "ativo";
            const codigoReferencia = atual.codigoReferencia || `GRAM-${String(atual.id).replace(/\D/g, '').slice(0, 4) || '1001'}`;

            req.session.usuario.plano = plano;
            req.session.usuario.statusPlano = statusPlano;
            req.session.usuario.codigoReferencia = codigoReferencia;

            return res.json({
                sucesso: true,
                usuario: {
                    id: atual.id,
                    nome: atual.nome,
                    email: atual.email,
                    tipo: "aluno",
                    plano,
                    statusPlano,
                    codigoReferencia
                }
            });
        }
    } catch (e) {
        console.warn("Erro ao buscar dados atualizados do aluno:", e);
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
