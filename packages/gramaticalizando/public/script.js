/* =========================================
   GRAMATICALIZANDO
   LOGIN + REGISTRO
========================================= */


/* =========================================
   LOGIN - ELEMENTOS
========================================= */

const abrirLogin =
    document.getElementById("abrir-login");

const modalLogin =
    document.getElementById("modal-login");

const fecharLogin =
    document.getElementById("fechar-login");

const formLogin =
    document.getElementById("form-login");

const loginEmail =
    document.getElementById("login-email");

const loginSenha =
    document.getElementById("login-senha");

const mostrarSenhaLogin =
    document.getElementById("mostrar-senha-login");


/* =========================================
   REGISTRO - ELEMENTOS
========================================= */

const abrirRegistro =
    document.getElementById("abrir-registro");

const modalRegistro =
    document.getElementById("modal-registro");

const fecharRegistro =
    document.getElementById("fechar-registro");

const voltarLogin =
    document.getElementById("voltar-login");

const formRegistro =
    document.getElementById("form-registro");

const registroNome =
    document.getElementById("registro-nome");

const registroEmail =
    document.getElementById("registro-email");

const registroSenha =
    document.getElementById("registro-senha");

const registroConfirmarSenha =
    document.getElementById(
        "registro-confirmar-senha"
    );

const mostrarSenhaRegistro =
    document.getElementById(
        "mostrar-senha-registro"
    );

const mostrarConfirmarSenha =
    document.getElementById(
        "mostrar-confirmar-senha"
    );

const mensagemRegistro =
    document.getElementById("mensagem-registro");


/* =========================================
   MENSAGEM LOGIN
========================================= */

const mensagemLogin =
    document.createElement("p");

mensagemLogin.className =
    "mensagem-login";

mensagemLogin.style.display =
    "none";

mensagemLogin.style.marginBottom =
    "13px";

mensagemLogin.style.padding =
    "10px 12px";

mensagemLogin.style.borderRadius =
    "9px";

mensagemLogin.style.fontSize =
    "12px";

mensagemLogin.style.lineHeight =
    "1.4";


formLogin.insertBefore(
    mensagemLogin,
    formLogin.querySelector(
        ".btn-auth-principal"
    )
);


/* =========================================
   FUNÇÕES MODAL
========================================= */

function abrirModal(modal) {

    modal.classList.add("ativo");

}


function fecharModal(modal) {

    modal.classList.remove("ativo");

}


/* =========================================
   ABRIR LOGIN
========================================= */

abrirLogin.addEventListener(
    "click",
    function () {

        esconderMensagemLogin();

        abrirModal(modalLogin);

    }
);


/* =========================================
   FECHAR LOGIN
========================================= */

fecharLogin.addEventListener(
    "click",
    function () {

        fecharModal(modalLogin);

    }
);


/* =========================================
   LOGIN -> REGISTRO
========================================= */

abrirRegistro.addEventListener(
    "click",
    function () {

        fecharModal(modalLogin);

        limparMensagemRegistro();

        abrirModal(modalRegistro);

    }
);


/* =========================================
   FECHAR REGISTRO
========================================= */

fecharRegistro.addEventListener(
    "click",
    function () {

        fecharModal(modalRegistro);

    }
);


/* =========================================
   REGISTRO -> LOGIN
========================================= */

voltarLogin.addEventListener(
    "click",
    function () {

        fecharModal(modalRegistro);

        esconderMensagemLogin();

        abrirModal(modalLogin);

    }
);


/* =========================================
   CLICAR FORA DO LOGIN
========================================= */

modalLogin.addEventListener(
    "click",
    function (event) {

        if (event.target === modalLogin) {

            fecharModal(modalLogin);

        }

    }
);


/* =========================================
   CLICAR FORA DO REGISTRO
========================================= */

modalRegistro.addEventListener(
    "click",
    function (event) {

        if (event.target === modalRegistro) {

            fecharModal(modalRegistro);

        }

    }
);


/* =========================================
   ESC
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            fecharModal(modalLogin);

            fecharModal(modalRegistro);

        }

    }
);


/* =========================================
   MOSTRAR SENHA
========================================= */

const SVG_EYE = `<svg class="axion-icon axion-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_EYE_OFF = `<svg class="axion-icon axion-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;

function configurarMostrarSenha(
    botao,
    input
) {
    if (!botao || !input) return;
    botao.innerHTML = SVG_EYE;

    botao.addEventListener(
        "click",
        function () {
            if (input.type === "password") {
                input.type = "text";
                botao.innerHTML = SVG_EYE_OFF;
            } else {
                input.type = "password";
                botao.innerHTML = SVG_EYE;
            }
        }
    );
}


configurarMostrarSenha(
    mostrarSenhaLogin,
    loginSenha
);


configurarMostrarSenha(
    mostrarSenhaRegistro,
    registroSenha
);


configurarMostrarSenha(
    mostrarConfirmarSenha,
    registroConfirmarSenha
);


/* =========================================
   MENSAGEM LOGIN
========================================= */

function mostrarMensagemLogin(
    mensagem,
    sucesso = false
) {

    mensagemLogin.style.display =
        "block";

    mensagemLogin.textContent =
        mensagem;


    if (sucesso) {

        mensagemLogin.style.background =
            "rgba(34, 197, 94, 0.10)";

        mensagemLogin.style.color =
            "#15803d";

    } else {

        mensagemLogin.style.background =
            "rgba(239, 68, 68, 0.08)";

        mensagemLogin.style.color =
            "#dc2626";

    }

}


function esconderMensagemLogin() {

    mensagemLogin.style.display =
        "none";

    mensagemLogin.textContent =
        "";

}


/* =========================================
   MENSAGEM REGISTRO
========================================= */

function mostrarErroRegistro(
    mensagem
) {

    mensagemRegistro.textContent =
        mensagem;

    mensagemRegistro.classList.add(
        "ativo"
    );

    mensagemRegistro.style.background =
        "rgba(239, 68, 68, 0.08)";

    mensagemRegistro.style.color =
        "#dc2626";

}


function mostrarSucessoRegistro(
    mensagem
) {

    mensagemRegistro.textContent =
        mensagem;

    mensagemRegistro.classList.add(
        "ativo"
    );

    mensagemRegistro.style.background =
        "rgba(34, 197, 94, 0.10)";

    mensagemRegistro.style.color =
        "#15803d";

}


function limparMensagemRegistro() {

    mensagemRegistro.textContent =
        "";

    mensagemRegistro.classList.remove(
        "ativo"
    );

    mensagemRegistro.style.background =
        "";

    mensagemRegistro.style.color =
        "";

}


/* =========================================
   REGISTRO
========================================= */

formRegistro.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        limparMensagemRegistro();


        const nome =
            registroNome.value.trim();

        const email =
            registroEmail.value.trim();

        const senha =
            registroSenha.value;

        const confirmarSenha =
            registroConfirmarSenha.value;


        if (nome.length < 3) {

            mostrarErroRegistro(
                "Digite um nome válido."
            );

            return;

        }


        if (senha.length < 6) {

            mostrarErroRegistro(
                "A senha precisa ter pelo menos 6 caracteres."
            );

            return;

        }


        if (senha !== confirmarSenha) {

            mostrarErroRegistro(
                "As senhas não são iguais."
            );

            return;

        }


        const botaoCriarConta =
            formRegistro.querySelector(
                ".btn-auth-principal"
            );


        botaoCriarConta.disabled =
            true;

        botaoCriarConta.textContent =
            "Criando conta...";


        try {

            const resposta =
                await fetch(
                    "/api/registro",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                nome,
                                email,
                                senha

                            })

                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                mostrarErroRegistro(
                    dados.mensagem
                );

                return;

            }


            mostrarSucessoRegistro(
                "Conta criada com sucesso!"
            );


            formRegistro.reset();


            setTimeout(
                function () {

                    fecharModal(
                        modalRegistro
                    );


                    loginEmail.value =
                        email;


                    loginSenha.value =
                        "";


                    mostrarMensagemLogin(
                        "Conta criada! Agora entre com sua senha.",
                        true
                    );


                    abrirModal(
                        modalLogin
                    );


                    loginSenha.focus();

                },
                700
            );

        } catch (erro) {

            console.error(erro);

            mostrarErroRegistro(
                "Não foi possível conectar ao servidor."
            );

        } finally {

            botaoCriarConta.disabled =
                false;

            botaoCriarConta.textContent =
                "Criar conta";

        }

    }
);


/* =========================================
   LOGIN
========================================= */

formLogin.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        esconderMensagemLogin();


        const email =
            loginEmail.value.trim();

        const senha =
            loginSenha.value;


        if (!email || !senha) {

            mostrarMensagemLogin(
                "Preencha e-mail e senha."
            );

            return;

        }


        const botaoEntrar =
            formLogin.querySelector(
                ".btn-auth-principal"
            );


        botaoEntrar.disabled =
            true;

        botaoEntrar.textContent =
            "Entrando...";


        try {

            const resposta =
                await fetch(
                    "/api/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email,
                                senha

                            })

                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                mostrarMensagemLogin(
                    dados.mensagem
                );

                return;

            }


            /* =================================
               SALVAR USUÁRIO NO NAVEGADOR
            ================================== */

            localStorage.setItem(
                "usuarioGramaticalizando",
                JSON.stringify(
                    dados.usuario
                )
            );


            mostrarMensagemLogin(
                `Bem-vindo, ${dados.usuario.nome}!`,
                true
            );


            /* =================================
               REDIRECIONAR
            ================================== */

            setTimeout(
                function () {

                    window.location.href =
                        "/aluno.html";

                },
                600
            );

        } catch (erro) {

            console.error(erro);

            mostrarMensagemLogin(
                "Não foi possível conectar ao servidor."
            );

        } finally {

            botaoEntrar.disabled =
                false;

            botaoEntrar.textContent =
                "Entrar";

        }

    }
);

/* =========================================
   SCROLL REVEAL OBSERVER & INTERSECTION
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach((el, index) => {
            el.style.setProperty("--i", (index % 6).toString());
            observer.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add("is-visible"));
    }
});