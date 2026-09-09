const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const readline = require("readline");


const CAMINHO_USUARIOS =
    path.join(
        __dirname,
        "usuarios.json"
    );


const rl =
    readline.createInterface({

        input:
            process.stdin,

        output:
            process.stdout

    });


function perguntar(
    pergunta
) {

    return new Promise(
        resolve => {

            rl.question(
                pergunta,
                resposta => {

                    resolve(
                        resposta
                            .trim()
                    );

                }
            );

        }
    );

}


async function lerUsuarios() {

    try {

        const dados =
            await fs.readFile(
                CAMINHO_USUARIOS,
                "utf8"
            );


        if (!dados.trim()) {

            return [];

        }


        return JSON.parse(
            dados
        );

    } catch (erro) {

        if (
            erro.code ===
            "ENOENT"
        ) {

            return [];

        }


        throw erro;

    }

}


async function salvarUsuarios(
    usuarios
) {

    await fs.writeFile(
        CAMINHO_USUARIOS,
        JSON.stringify(
            usuarios,
            null,
            4
        )
    );

}


async function criarAdmin() {

    try {

        console.log(
            "\n=============================="
        );

        console.log(
            " CRIAR ADMINISTRADOR"
        );

        console.log(
            "==============================\n"
        );


        const nome =
            await perguntar(
                "Nome da administradora: "
            );


        const email =
            (
                await perguntar(
                    "E-mail: "
                )
            )
                .toLowerCase();


        const senha =
            await perguntar(
                "Senha: "
            );


        if (
            nome.length <
            3
        ) {

            console.log(
                "\nNome inválido."
            );

            return;

        }


        if (
            !email.includes(
                "@"
            )
        ) {

            console.log(
                "\nE-mail inválido."
            );

            return;

        }


        if (
            senha.length <
            6
        ) {

            console.log(
                "\nA senha precisa ter pelo menos 6 caracteres."
            );

            return;

        }


        const usuarios =
            await lerUsuarios();


        const existente =
            usuarios.find(
                usuario =>
                    usuario.email ===
                    email
            );


        if (existente) {

            console.log(
                "\nJá existe uma conta com esse e-mail."
            );

            return;

        }


        const senhaHash =
            await bcrypt.hash(
                senha,
                10
            );


        const admin = {

            id:
                crypto.randomUUID(),

            nome:
                nome,

            email:
                email,

            senha:
                senhaHash,

            tipo:
                "admin",

            criadoEm:
                new Date()
                    .toISOString()

        };


        usuarios.push(
            admin
        );


        await salvarUsuarios(
            usuarios
        );


        console.log(
            "\n✅ Administrador criado com sucesso!"
        );


        console.log(
            `Nome: ${admin.nome}`
        );


        console.log(
            `E-mail: ${admin.email}`
        );


        console.log(
            "Tipo: admin"
        );


        console.log(
            "\nAgora use /admin-login.html para entrar."
        );

    } catch (erro) {

        console.error(
            "\nErro ao criar administrador:",
            erro
        );

    } finally {

        rl.close();

    }

}


criarAdmin();