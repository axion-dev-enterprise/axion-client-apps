const params = new URLSearchParams(window.location.search);
const aulaId = params.get("id");

const telaCarregamento = document.getElementById("tela-carregamento");
const telaErro = document.getElementById("tela-erro");
const mensagemErro = document.getElementById("mensagem-erro");
const btnErroVoltar = document.getElementById("btn-erro-voltar");
const aulaApp = document.getElementById("aula-app");

const btnVoltar = document.getElementById("btn-voltar");

const topbarMateria = document.getElementById("topbar-materia");
const progressoTopoTexto = document.getElementById("progresso-topo-texto");
const barraTopoPreenchida = document.getElementById("barra-topo-preenchida");
const avatarAluno = document.getElementById("avatar-aluno");

const breadcrumbMateria = document.getElementById("breadcrumb-materia");

const aulaTitulo = document.getElementById("aula-titulo");
const aulaSubtitulo = document.getElementById("aula-subtitulo");

const metaMateria = document.getElementById("meta-materia");
const metaStatus = document.getElementById("meta-status");

const statusAula = document.getElementById("status-aula");
const conteudoAula = document.getElementById("conteudo-aula");

const semExercicios = document.getElementById("sem-exercicios");
const listaExercicios = document.getElementById("lista-exercicios");
const templateExercicio = document.getElementById("template-exercicio");

const progressoPercentual = document.getElementById("progresso-percentual");
const aulasConcluidas = document.getElementById("aulas-concluidas");
const totalAulas = document.getElementById("total-aulas");

const btnConcluirAula = document.getElementById("btn-concluir-aula");
const aulaConcluidaBox = document.getElementById("aula-concluida-box");

const btnPraticar = document.getElementById("btn-praticar");

const toast = document.getElementById("toast");
const toastMensagem = document.getElementById("toast-mensagem");

let usuario = null;
let dadosAula = null;
let primeiroExercicioId = null;
let toastTimeout = null;


/* =====================================================
   USUÁRIO
===================================================== */

function carregarUsuario() {

    try {

        const salvo =
            localStorage.getItem(
                "usuarioGramaticalizando"
            );

        if (!salvo) {

            window.location.href = "/";
            return null;

        }

        const dados =
            JSON.parse(salvo);

        if (
            !dados ||
            !dados.id
        ) {

            localStorage.removeItem(
                "usuarioGramaticalizando"
            );

            window.location.href = "/";
            return null;

        }

        return dados;

    } catch (erro) {

        console.error(
            "Erro ao carregar usuário:",
            erro
        );

        localStorage.removeItem(
            "usuarioGramaticalizando"
        );

        window.location.href = "/";

        return null;

    }

}


/* =====================================================
   TELAS
===================================================== */

function mostrarCarregamento() {

    telaCarregamento?.classList.remove(
        "escondido"
    );

    telaErro?.classList.add(
        "escondido"
    );

    aulaApp?.classList.add(
        "escondido"
    );

}


function mostrarErro(
    mensagem =
        "Não foi possível carregar esta aula."
) {

    telaCarregamento?.classList.add(
        "escondido"
    );

    aulaApp?.classList.add(
        "escondido"
    );

    telaErro?.classList.remove(
        "escondido"
    );

    if (mensagemErro) {

        mensagemErro.textContent =
            mensagem;

    }

}


function mostrarAula() {

    telaCarregamento?.classList.add(
        "escondido"
    );

    telaErro?.classList.add(
        "escondido"
    );

    aulaApp?.classList.remove(
        "escondido"
    );

}


/* =====================================================
   TOAST
===================================================== */

function mostrarToast(
    mensagem
) {

    if (
        !toast ||
        !toastMensagem
    ) {
        return;
    }

    toastMensagem.textContent =
        mensagem;

    toast.classList.remove(
        "escondido"
    );

    clearTimeout(
        toastTimeout
    );

    toastTimeout =
        setTimeout(
            () => {

                toast.classList.add(
                    "escondido"
                );

            },
            3000
        );

}


/* =====================================================
   AVATAR
===================================================== */

function renderizarAvatar() {

    if (
        !usuario ||
        !avatarAluno
    ) {
        return;
    }

    const nome =
        String(
            usuario.nome ||
            "Aluno"
        ).trim();

    const inicial =
        nome
            .charAt(0)
            .toUpperCase();

    avatarAluno.textContent =
        inicial || "A";

}


/* =====================================================
   PROGRESSO
===================================================== */

function renderizarProgresso(
    progresso
) {

    const total =
        Number(
            progresso?.totalAulas ||
            0
        );

    const concluidas =
        Number(
            progresso?.aulasConcluidas ||
            0
        );

    let porcentagem =
        Number(
            progresso?.porcentagem ||
            0
        );

    if (
        !Number.isFinite(
            porcentagem
        )
    ) {

        porcentagem = 0;

    }

    porcentagem =
        Math.max(
            0,
            Math.min(
                100,
                porcentagem
            )
        );

    if (progressoPercentual) {

        progressoPercentual.textContent =
            `${porcentagem}%`;

    }

    if (aulasConcluidas) {

        aulasConcluidas.textContent =
            concluidas;

    }

    if (totalAulas) {

        totalAulas.textContent =
            total;

    }

    if (progressoTopoTexto) {

        progressoTopoTexto.textContent =
            `${porcentagem}% concluído`;

    }

    if (barraTopoPreenchida) {

        barraTopoPreenchida.style.width =
            `${porcentagem}%`;

    }

}


/* =====================================================
   STATUS DA AULA
===================================================== */

function atualizarStatusAula(
    concluida
) {

    if (concluida) {

        if (statusAula) {

            statusAula.textContent =
                "Aula concluída";

            statusAula.classList.add(
                "concluida"
            );

        }

        if (metaStatus) {

            metaStatus.textContent =
                "Concluída";

        }

        btnConcluirAula?.classList.add(
            "escondido"
        );

        aulaConcluidaBox?.classList.remove(
            "escondido"
        );

        return;

    }


    if (statusAula) {

        statusAula.textContent =
            "Em andamento";

        statusAula.classList.remove(
            "concluida"
        );

    }

    if (metaStatus) {

        metaStatus.textContent =
            "Em andamento";

    }

    btnConcluirAula?.classList.remove(
        "escondido"
    );

    aulaConcluidaBox?.classList.add(
        "escondido"
    );

}


/* =====================================================
   EXERCÍCIOS
===================================================== */

function limparExercicios() {

    if (!listaExercicios) {
        return;
    }

    listaExercicios.innerHTML =
        "";

}


function renderizarExercicios(
    exercicios
) {

    limparExercicios();

    primeiroExercicioId =
        null;

    if (
        !Array.isArray(exercicios) ||
        exercicios.length === 0
    ) {

        semExercicios?.classList.remove(
            "escondido"
        );

        listaExercicios?.classList.add(
            "escondido"
        );

        btnPraticar?.classList.add(
            "escondido"
        );

        return;

    }


    semExercicios?.classList.add(
        "escondido"
    );

    listaExercicios?.classList.remove(
        "escondido"
    );

    btnPraticar?.classList.remove(
        "escondido"
    );


    primeiroExercicioId =
        exercicios[0].id;


    exercicios.forEach(
        exercicio => {

            if (!templateExercicio) {
                return;
            }

            const fragmento =
                templateExercicio.content.cloneNode(
                    true
                );

            const card =
                fragmento.querySelector(
                    ".exercicio-card"
                );

            const titulo =
                fragmento.querySelector(
                    ".exercicio-titulo"
                );

            const descricao =
                fragmento.querySelector(
                    ".exercicio-descricao"
                );

            const quantidade =
                fragmento.querySelector(
                    ".exercicio-questoes"
                );

            const botao =
                fragmento.querySelector(
                    ".btn-abrir-exercicio"
                );


            if (titulo) {

                titulo.textContent =
                    exercicio.titulo ||
                    "Exercício";

            }


            if (descricao) {

                const texto =
                    String(
                        exercicio.descricao ||
                        ""
                    ).trim();

                if (texto) {

                    descricao.textContent =
                        texto;

                } else {

                    descricao.textContent =
                        "Pratique o conteúdo desta aula.";

                }

            }


            if (quantidade) {

                const totalQuestoes =
                    Number(
                        exercicio.totalQuestoes ||
                        0
                    );

                quantidade.textContent =
                    `${totalQuestoes} ${
                        totalQuestoes === 1
                            ? "questão"
                            : "questões"
                    }`;

            }


            if (botao) {

                botao.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `/exercicio.html?id=${encodeURIComponent(
                                exercicio.id
                            )}`;

                    }
                );

            }


            if (card) {

                card.dataset.exercicioId =
                    exercicio.id;

            }


            listaExercicios.appendChild(
                fragmento
            );

        }
    );

}


/* =====================================================
   RENDERIZAR AULA
===================================================== */

function renderizarAula(
    dados
) {

    const aula =
        dados.aula;

    const materia =
        dados.materia;

    const progresso =
        dados.progresso;

    const exercicios =
        dados.exercicios || [];


    dadosAula =
        dados;


    const nomeMateria =
        materia?.nome ||
        "Matéria";


    if (topbarMateria) {

        topbarMateria.textContent =
            nomeMateria;

    }


    if (breadcrumbMateria) {

        breadcrumbMateria.textContent =
            nomeMateria;

    }


    if (metaMateria) {

        metaMateria.textContent =
            nomeMateria;

    }


    if (aulaTitulo) {

        aulaTitulo.textContent =
            aula?.titulo ||
            "Aula";

    }


    if (aulaSubtitulo) {

        aulaSubtitulo.textContent =
            `Conteúdo da matéria ${nomeMateria}`;

    }


    if (conteudoAula) {

        const conteudo =
            String(
                aula?.conteudo ||
                ""
            ).trim();

        if (conteudo) {

            conteudoAula.innerHTML =
                conteudo;

        } else {

            conteudoAula.innerHTML =
                `
                    <p>
                        O conteúdo desta aula ainda não foi adicionado.
                    </p>
                `;

        }

    }


    renderizarProgresso(
        progresso
    );


    atualizarStatusAula(
        Boolean(
            aula?.concluida
        )
    );


    renderizarExercicios(
        exercicios
    );

}


/* =====================================================
   CARREGAR AULA
===================================================== */

async function carregarAula() {

    if (!aulaId) {

        mostrarErro(
            "A aula não foi informada."
        );

        return;

    }


    mostrarCarregamento();


    try {

        const resposta =
            await fetch(
                `/api/aluno/aulas/${encodeURIComponent(
                    aulaId
                )}?usuarioId=${encodeURIComponent(
                    usuario.id
                )}`
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível carregar a aula."
            );

        }


        renderizarAula(
            dados
        );


        mostrarAula();


    } catch (erro) {

        console.error(
            "Erro ao carregar aula:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Não foi possível carregar esta aula."
        );

    }

}


/* =====================================================
   CONCLUIR AULA
===================================================== */

async function concluirAula() {

    if (
        !aulaId ||
        !usuario?.id
    ) {
        return;
    }


    if (btnConcluirAula) {

        btnConcluirAula.disabled =
            true;

        btnConcluirAula.dataset.textoOriginal =
            btnConcluirAula.textContent;

        btnConcluirAula.textContent =
            "Concluindo...";

    }


    try {

        const resposta =
            await fetch(
                `/api/aluno/aulas/${encodeURIComponent(
                    aulaId
                )}/concluir`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            usuarioId:
                                usuario.id
                        })
                }
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Não foi possível concluir a aula."
            );

        }


        if (
            dadosAula &&
            dadosAula.aula
        ) {

            dadosAula.aula.concluida =
                true;

        }


        atualizarStatusAula(
            true
        );


        if (dados.progresso) {

            renderizarProgresso(
                dados.progresso
            );

        }


        mostrarToast(
            dados.jaConcluida
                ?
                    "Esta aula já estava concluída."
                :
                    "Aula concluída com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro ao concluir aula:",
            erro
        );

        mostrarToast(
            erro.message ||
            "Erro ao concluir aula."
        );


        if (btnConcluirAula) {

            btnConcluirAula.disabled =
                false;

            btnConcluirAula.textContent =
                btnConcluirAula.dataset.textoOriginal ||
                "Concluir aula";

        }

    }

}


/* =====================================================
   EVENTOS
===================================================== */

btnVoltar?.addEventListener(
    "click",
    () => {

        window.location.href =
            "/aluno.html";

    }
);


btnErroVoltar?.addEventListener(
    "click",
    () => {

        window.location.href =
            "/aluno.html";

    }
);


btnConcluirAula?.addEventListener(
    "click",
    concluirAula
);


btnPraticar?.addEventListener(
    "click",
    () => {

        if (!primeiroExercicioId) {

            mostrarToast(
                "Esta aula ainda não possui exercícios."
            );

            return;

        }

        window.location.href =
            `/exercicio.html?id=${encodeURIComponent(
                primeiroExercicioId
            )}`;

    }
);


/* =====================================================
   INICIAR
===================================================== */

usuario =
    carregarUsuario();


if (usuario) {

    renderizarAvatar();

    carregarAula();

}