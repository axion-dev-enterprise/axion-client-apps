const form =
    document.getElementById(
        "form-admin-login"
    );

const email =
    document.getElementById(
        "admin-email"
    );

const senha =
    document.getElementById(
        "admin-senha"
    );

const mostrarSenha =
    document.getElementById(
        "mostrar-senha"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );

const btnEntrar =
    document.getElementById(
        "btn-entrar"
    );


function exibirMensagem(
    texto,
    tipo
) {

    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem " +
        tipo;

}


function limparMensagem() {

    mensagem.textContent =
        "";


    mensagem.className =
        "mensagem";

}


mostrarSenha.addEventListener(
    "click",
    function () {

        if (
            senha.type ===
            "password"
        ) {

            senha.type =
                "text";


            mostrarSenha.textContent =
                "🙈";


            mostrarSenha.setAttribute(
                "aria-label",
                "Ocultar senha"
            );

        } else {

            senha.type =
                "password";


            mostrarSenha.textContent =
                "👁";


            mostrarSenha.setAttribute(
                "aria-label",
                "Mostrar senha"
            );

        }

    }
);


async function verificarSessao() {

    try {

        const resposta =
            await fetch(
                "/api/admin/me"
            );


        if (
            resposta.ok
        ) {

            window.location.href =
                "/admin.html";

        }

    } catch (erro) {

        console.log(
            "Nenhuma sessão administrativa ativa."
        );

    }

}


verificarSessao();


form.addEventListener(
    "submit",
    async function (
        event
    ) {

        event.preventDefault();


        limparMensagem();


        const emailDigitado =
            email.value
                .trim();


        const senhaDigitada =
            senha.value;


        if (
            !emailDigitado ||
            !senhaDigitada
        ) {

            exibirMensagem(
                "Preencha e-mail e senha.",
                "erro"
            );


            return;

        }


        btnEntrar.disabled =
            true;


        btnEntrar.textContent =
            "Entrando...";


        try {

            const resposta =
                await fetch(
                    "/api/admin/login",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email:
                                    emailDigitado,

                                senha:
                                    senhaDigitada

                            })

                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                exibirMensagem(
                    dados.mensagem ||
                    "Não foi possível entrar.",
                    "erro"
                );


                return;

            }


            exibirMensagem(
                `Bem-vinda, ${dados.usuario.nome}!`,
                "sucesso"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "/admin.html";

                },
                350
            );

        } catch (erro) {

            console.error(
                erro
            );


            exibirMensagem(
                "Não foi possível conectar ao servidor.",
                "erro"
            );

        } finally {

            btnEntrar.disabled =
                false;


            btnEntrar.textContent =
                "Entrar no painel";

        }

    }
);