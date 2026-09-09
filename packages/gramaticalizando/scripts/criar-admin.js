const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const paths = require("../src/config/paths");
const { lerArquivoJson, salvarArquivoJson } = require("../src/data/jsonStore");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(pergunta) {
    return new Promise(resolve => {
        rl.question(pergunta, resposta => resolve(resposta.trim()));
    });
}

async function criarAdmin() {
    try {
        console.log("\n==============================");
        console.log(" CRIAR ADMINISTRADOR (MODULAR)");
        console.log("==============================\n");

        const nome = await perguntar("Nome da administradora: ");
        const email = (await perguntar("E-mail: ")).toLowerCase();
        const senha = await perguntar("Senha: ");

        if (nome.length < 3) {
            console.log("\nNome inválido.");
            return;
        }
        if (!email.includes("@")) {
            console.log("\nE-mail inválido.");
            return;
        }
        if (senha.length < 6) {
            console.log("\nA senha precisa ter pelo menos 6 caracteres.");
            return;
        }

        const usuarios = await lerArquivoJson(paths.USUARIOS);
        const existente = usuarios.find(u => u.email === email);

        if (existente) {
            console.log("\nJá existe uma conta com esse e-mail.");
            return;
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const admin = {
            id: crypto.randomUUID(),
            nome,
            email,
            senha: senhaHash,
            tipo: "admin",
            criadoEm: new Date().toISOString()
        };

        usuarios.push(admin);
        await salvarArquivoJson(paths.USUARIOS, usuarios);

        console.log("\n✅ Administrador criado com sucesso!");
        console.log(`Nome: ${admin.nome}`);
        console.log(`E-mail: ${admin.email}`);
        console.log("Tipo: admin");
        console.log("\nAgora acesse /admin-login.html para entrar.");
    } catch (erro) {
        console.error("\nErro ao criar administrador:", erro);
    } finally {
        rl.close();
    }
}

criarAdmin();
