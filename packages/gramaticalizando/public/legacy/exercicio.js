const params = new URLSearchParams(window.location.search);
const exercicioId = params.get("id");

const telaCarregamento = document.getElementById("tela-carregamento");
const telaErro = document.getElementById("tela-erro");
const mensagemErro = document.getElementById("mensagem-erro");
const btnErroVoltar = document.getElementById("btn-erro-voltar");
const exercicioApp = document.getElementById("exercicio-app");

const btnVoltar = document.getElementById("btn-voltar");

const topbarMateria = document.getElementById("topbar-materia");
const avatarAluno = document.getElementById("avatar-aluno");

const questoesRespondidas = document.getElementById("questoes-respondidas");

const breadcrumbMateria = document.getElementById("breadcrumb-materia");
const breadcrumbAula = document.getElementById("breadcrumb-aula");

const exercicioTitulo = document.getElementById("exercicio-titulo");
const exercicioDescricao = document.getElementById("exercicio-descricao");

const metaMateria = document.getElementById("meta-materia");
const metaAula = document.getElementById("meta-aula");
const metaTotalQuestoes = document.getElementById("meta-total-questoes");

const listaQuestoes = document.getElementById("lista-questoes");

const templateQuestao = document.getElementById("template-questao");
const templateAlternativa = document.getElementById("template-alternativa");
const templateCorrecao = document.getElementById("template-correcao");

const areaFinalizar = document.getElementById("area-finalizar");

const btnFinalizar = document.getElementById("btn-finalizar");
const btnFinalizarLateral = document.getElementById("btn-finalizar-lateral");

const progressoRespondidas = document.getElementById("progresso-respondidas");
const progressoTotal = document.getElementById("progresso-total");
const progressoPercentual = document.getElementById("progresso-percentual");
const barraProgressoPreenchida = document.getElementById("barra-progresso-preenchida");

const resultadoExercicio = document.getElementById("resultado-exercicio");
const resultadoPorcentagem = document.getElementById("resultado-porcentagem");
const resultadoTotal = document.getElementById("resultado-total");
const resultadoCorretas = document.getElementById("resultado-corretas");
const resultadoErradas = document.getElementById("resultado-erradas");
const listaCorrecao = document.getElementById("lista-correcao");

const btnVoltarAulaResultado = document.getElementById("btn-voltar-aula-resultado");
const btnRefazer = document.getElementById("btn-refazer");

const modalFinalizar = document.getElementById("modal-finalizar");
const modalFinalizarTexto = document.getElementById("modal-finalizar-texto");
const btnCancelarFinalizacao = document.getElementById("btn-cancelar-finalizacao");
const btnConfirmarFinalizacao = document.getElementById("btn-confirmar-finalizacao");

const toast = document.getElementById("toast");
const toastMensagem = document.getElementById("toast-mensagem");


let usuario = null;
let exercicioAtual = null;
let aulaId = null;
let finalizado = false;
let enviando = false;
let toastTimeout = null;


/* =====================================================
   USUÁRIO
===================================================== */

function carregarUsuario() {

    try {

        const salvo = localStorage.getItem(
            "usuarioGramaticalizando"
        );

        if (!salvo) {

            window.location.href = "/";
            return null;

        }

        const dados = JSON.parse(salvo);

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

    exercicioApp?.classList.add(
        "escondido"
    );

}


function mostrarErro(
    mensagem = "Não foi possível carregar este exercício."
) {

    telaCarregamento?.classList.add(
        "escondido"
    );

    exercicioApp?.classList.add(
        "escondido"
    );

    telaErro?.classList.remove(
        "escondido"
    );

    if (mensagemErro) {

        mensagemErro.textContent = mensagem;

    }

}


function mostrarAplicacao() {

    telaCarregamento?.classList.add(
        "escondido"
    );

    telaErro?.classList.add(
        "escondido"
    );

    exercicioApp?.classList.remove(
        "escondido"
    );

}


/* =====================================================
   TOAST
===================================================== */

function mostrarToast(mensagem) {

    if (
        !toast ||
        !toastMensagem
    ) {
        return;
    }

    toastMensagem.textContent = mensagem;

    toast.classList.remove(
        "escondido"
    );

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(
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
        !avatarAluno ||
        !usuario
    ) {
        return;
    }

    const nome = String(
        usuario.nome || "Aluno"
    ).trim();

    avatarAluno.textContent =
        nome.charAt(0).toUpperCase() || "A";

}


/* =====================================================
   VOLTAR PARA AULA
===================================================== */

function voltarParaAula() {

    if (aulaId) {

        window.location.href =
            `/aula.html?id=${encodeURIComponent(aulaId)}`;

        return;

    }

    window.location.href = "/aluno.html";

}


/* =====================================================
   PROGRESSO
===================================================== */

function contarRespondidas() {

    if (!exercicioAtual?.questoes) {
        return 0;
    }

    let respondidas = 0;

    exercicioAtual.questoes.forEach(
        questao => {

            if (
                questao.tipo ===
                "multipla-escolha"
            ) {

                const marcada =
                    document.querySelector(
                        `input[name="questao-${CSS.escape(questao.id)}"]:checked`
                    );

                if (marcada) {
                    respondidas++;
                }

                return;

            }


            if (
                questao.tipo ===
                "resposta-escrita"
            ) {

                const campo =
                    document.querySelector(
                        `[data-resposta-escrita="${CSS.escape(questao.id)}"]`
                    );

                if (
                    campo &&
                    campo.value.trim()
                ) {

                    respondidas++;

                }

            }

        }
    );

    return respondidas;

}


function atualizarProgresso() {

    const total =
        exercicioAtual?.questoes?.length || 0;

    const respondidas =
        contarRespondidas();

    const porcentagem =
        total > 0
            ? Math.round(
                (respondidas / total) * 100
            )
            : 0;


    if (questoesRespondidas) {

        questoesRespondidas.textContent =
            `${respondidas} / ${total}`;

    }


    if (progressoRespondidas) {

        progressoRespondidas.textContent =
            respondidas;

    }


    if (progressoTotal) {

        progressoTotal.textContent =
            total;

    }


    if (progressoPercentual) {

        progressoPercentual.textContent =
            `${porcentagem}%`;

    }


    if (barraProgressoPreenchida) {

        barraProgressoPreenchida.style.width =
            `${porcentagem}%`;

    }

}


/* =====================================================
   CRIAR MÚLTIPLA ESCOLHA
===================================================== */

function criarMultiplaEscolha(
    questao,
    indice,
    container
) {

    const alternativas =
        Array.isArray(questao.alternativas)
            ? questao.alternativas
            : [];


    alternativas.forEach(
        (alternativa, alternativaIndice) => {

            const fragmento =
                templateAlternativa.content.cloneNode(
                    true
                );

            const label =
                fragmento.querySelector(
                    ".alternativa"
                );

            const input =
                fragmento.querySelector(
                    ".alternativa-input"
                );

            const letra =
                fragmento.querySelector(
                    ".alternativa-letra"
                );

            const texto =
                fragmento.querySelector(
                    ".alternativa-texto"
                );


            const letras =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


            if (input) {

                input.name =
                    `questao-${questao.id}`;

                input.value =
                    alternativa.id;

                input.id =
                    `questao-${indice}-alternativa-${alternativaIndice}`;

                input.addEventListener(
                    "change",
                    atualizarProgresso
                );

            }


            if (label && input) {

                label.setAttribute(
                    "for",
                    input.id
                );

            }


            if (letra) {

                letra.textContent =
                    letras[alternativaIndice] ||
                    String(
                        alternativaIndice + 1
                    );

            }


            if (texto) {

                texto.textContent =
                    alternativa.texto || "";

            }


            container.appendChild(
                fragmento
            );

        }
    );

}


/* =====================================================
   CRIAR RESPOSTA ESCRITA
===================================================== */

function criarRespostaEscrita(
    questao,
    container
) {

    const textarea =
        document.createElement(
            "textarea"
        );

    textarea.className =
        "resposta-escrita";

    textarea.placeholder =
        "Digite sua resposta aqui...";

    textarea.dataset.respostaEscrita =
        questao.id;

    textarea.setAttribute(
        "aria-label",
        `Resposta da questão: ${questao.enunciado}`
    );

    textarea.addEventListener(
        "input",
        atualizarProgresso
    );

    container.appendChild(
        textarea
    );

}


/* =====================================================
   RENDERIZAR QUESTÕES
===================================================== */

function renderizarQuestoes() {

    if (
        !listaQuestoes ||
        !templateQuestao
    ) {
        return;
    }


    listaQuestoes.innerHTML = "";


    const questoes =
        exercicioAtual?.questoes || [];


    questoes.forEach(
        (questao, indice) => {

            const fragmento =
                templateQuestao.content.cloneNode(
                    true
                );

            const card =
                fragmento.querySelector(
                    ".questao-card"
                );

            const numero =
                fragmento.querySelector(
                    ".questao-numero"
                );

            const tipo =
                fragmento.querySelector(
                    ".questao-tipo"
                );

            const enunciado =
                fragmento.querySelector(
                    ".questao-enunciado"
                );

            const resposta =
                fragmento.querySelector(
                    ".questao-resposta"
                );


            if (card) {

                card.dataset.questaoId =
                    questao.id;

            }


            if (numero) {

                numero.textContent =
                    `Questão ${indice + 1}`;

            }


            if (tipo) {

                tipo.textContent =
                    questao.tipo ===
                    "multipla-escolha"
                        ? "Múltipla escolha"
                        : "Resposta escrita";

            }


            if (enunciado) {

                enunciado.textContent =
                    questao.enunciado || "";

            }


            if (resposta) {

                if (
                    questao.tipo ===
                    "multipla-escolha"
                ) {

                    criarMultiplaEscolha(
                        questao,
                        indice,
                        resposta
                    );

                } else if (
                    questao.tipo ===
                    "resposta-escrita"
                ) {

                    criarRespostaEscrita(
                        questao,
                        resposta
                    );

                }

            }


            listaQuestoes.appendChild(
                fragmento
            );

        }
    );


    atualizarProgresso();

}


/* =====================================================
   RENDERIZAR CABEÇALHO
===================================================== */

function renderizarCabecalho() {

    const materia =
        exercicioAtual?.materia;

    const aula =
        exercicioAtual?.aula;


    const nomeMateria =
        materia?.nome ||
        exercicioAtual?.materiaNome ||
        "Matéria";


    const nomeAula =
        aula?.titulo ||
        exercicioAtual?.aulaTitulo ||
        "Aula";


    if (topbarMateria) {

        topbarMateria.textContent =
            nomeMateria;

    }


    if (breadcrumbMateria) {

        breadcrumbMateria.textContent =
            nomeMateria;

    }


    if (breadcrumbAula) {

        breadcrumbAula.textContent =
            nomeAula;

    }


    if (metaMateria) {

        metaMateria.textContent =
            nomeMateria;

    }


    if (metaAula) {

        metaAula.textContent =
            nomeAula;

    }


    if (exercicioTitulo) {

        exercicioTitulo.textContent =
            exercicioAtual?.titulo ||
            "Exercício";

    }


    if (exercicioDescricao) {

        const descricao =
            String(
                exercicioAtual?.descricao ||
                ""
            ).trim();

        exercicioDescricao.textContent =
            descricao ||
            "Responda às questões abaixo e finalize quando terminar.";

    }


    if (metaTotalQuestoes) {

        metaTotalQuestoes.textContent =
            exercicioAtual?.questoes?.length ||
            0;

    }

}


/* =====================================================
   CARREGAR EXERCÍCIO
===================================================== */

async function carregarExercicio() {

    if (!exercicioId) {

        mostrarErro(
            "O exercício não foi informado."
        );

        return;

    }


    mostrarCarregamento();


    try {

        const resposta =
            await fetch(
                `/api/aluno/exercicios/${encodeURIComponent(
                    exercicioId
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
                "Não foi possível carregar o exercício."
            );

        }


        /*
         * Aceita tanto:
         *
         * { sucesso: true, exercicio: {...} }
         *
         * quanto:
         *
         * { sucesso: true, ...dadosDoExercicio }
         */

         exercicioAtual =
    dados.exercicio || dados;


/*
 * Algumas versões da rota devolvem
 * matéria e aula fora do objeto exercicio.
 * Aqui juntamos tudo para a página
 * conseguir renderizar corretamente.
 */

if (
    dados.materia &&
    !exercicioAtual.materia
) {

    exercicioAtual.materia =
        dados.materia;

}


if (
    dados.aula &&
    !exercicioAtual.aula
) {

    exercicioAtual.aula =
        dados.aula;

}


        if (
            !exercicioAtual ||
            !Array.isArray(
                exercicioAtual.questoes
            )
        ) {

            throw new Error(
                "Os dados deste exercício são inválidos."
            );

        }


        aulaId =
            exercicioAtual.aulaId ||
            exercicioAtual.aula?.id ||
            null;


        renderizarCabecalho();

        renderizarQuestoes();

        mostrarAplicacao();


    } catch (erro) {

        console.error(
            "Erro ao carregar exercício:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Não foi possível carregar este exercício."
        );

    }

}


/* =====================================================
   PEGAR RESPOSTAS
===================================================== */

function obterRespostas() {

    if (!exercicioAtual?.questoes) {
        return [];
    }


    return exercicioAtual.questoes.map(
        questao => {

            let resposta = "";


            if (
                questao.tipo ===
                "multipla-escolha"
            ) {

                const marcada =
                    document.querySelector(
                        `input[name="questao-${CSS.escape(questao.id)}"]:checked`
                    );

                if (marcada) {

                    resposta =
                        marcada.value;

                }

            }


            if (
                questao.tipo ===
                "resposta-escrita"
            ) {

                const campo =
                    document.querySelector(
                        `[data-resposta-escrita="${CSS.escape(questao.id)}"]`
                    );

                if (campo) {

                    resposta =
                        campo.value.trim();

                }

            }


            return {
                questaoId:
                    questao.id,

                resposta
            };

        }
    );

}


/* =====================================================
   ABRIR CONFIRMAÇÃO
===================================================== */

function solicitarFinalizacao() {

    if (
        finalizado ||
        enviando
    ) {
        return;
    }


    const total =
        exercicioAtual?.questoes?.length ||
        0;

    const respondidas =
        contarRespondidas();

    const faltando =
        total - respondidas;


    if (modalFinalizarTexto) {

        if (faltando > 0) {

            modalFinalizarTexto.textContent =
                `Você ainda deixou ${
                    faltando
                } ${
                    faltando === 1
                        ? "questão"
                        : "questões"
                } sem resposta. Deseja finalizar mesmo assim?`;

        } else {

            modalFinalizarTexto.textContent =
                "Todas as questões foram respondidas. Deseja enviar suas respostas para correção?";

        }

    }


    modalFinalizar?.classList.remove(
        "escondido"
    );

}


/* =====================================================
   FECHAR CONFIRMAÇÃO
===================================================== */

function fecharModal() {

    modalFinalizar?.classList.add(
        "escondido"
    );

}


/* =====================================================
   BLOQUEAR QUESTÕES
===================================================== */

function bloquearQuestoes() {

    document
        .querySelectorAll(
            ".alternativa-input, .resposta-escrita"
        )
        .forEach(
            campo => {

                campo.disabled = true;

            }
        );


    exercicioApp?.classList.add(
        "exercicio-finalizado"
    );

}


/* =====================================================
   CORREÇÃO
===================================================== */

function textoRespostaAluno(
    questaoResultado
) {

    const valor =
        questaoResultado?.respostaAluno;

    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ""
    ) {

        return "Não respondida";

    }


    /*
     * Se o backend já devolver o texto da alternativa,
     * usamos diretamente.
     *
     * Se devolver o ID, tentamos localizar o texto.
     */

    const questaoOriginal =
        exercicioAtual?.questoes?.find(
            questao =>
                questao.id ===
                questaoResultado.questaoId
        );


    if (
        questaoOriginal?.tipo ===
        "multipla-escolha"
    ) {

        const alternativa =
            questaoOriginal.alternativas?.find(
                item =>
                    String(item.id) ===
                    String(valor)
            );


        if (alternativa) {

            return alternativa.texto;

        }

    }


    return String(valor);

}


function renderizarCorrecao(
    resultado
) {

    if (!listaCorrecao) {
        return;
    }


    listaCorrecao.innerHTML =
        "";


    const questoes =
        Array.isArray(resultado.questoes)
            ? resultado.questoes
            : [];


    questoes.forEach(
        (questao, indice) => {

            const fragmento =
                templateCorrecao.content.cloneNode(
                    true
                );


            const card =
                fragmento.querySelector(
                    ".correcao-card"
                );

            const numero =
                fragmento.querySelector(
                    ".correcao-numero"
                );

            const status =
                fragmento.querySelector(
                    ".correcao-status"
                );

            const enunciado =
                fragmento.querySelector(
                    ".correcao-enunciado"
                );

            const respostaAluno =
                fragmento.querySelector(
                    ".correcao-resposta-aluno"
                );

            const respostaCorreta =
                fragmento.querySelector(
                    ".correcao-resposta-correta"
                );


            const correta =
                Boolean(
                    questao.correta
                );


            if (card) {

                card.classList.add(
                    correta
                        ? "correta"
                        : "errada"
                );

            }


            if (numero) {

                numero.textContent =
                    `Questão ${indice + 1}`;

            }


            if (status) {

                status.textContent =
                    correta
                        ? "Correta"
                        : "Incorreta";

            }


            if (enunciado) {

                enunciado.textContent =
                    questao.enunciado ||
                    "";

            }


            if (respostaAluno) {

                respostaAluno.textContent =
                    textoRespostaAluno(
                        questao
                    );

            }


            if (respostaCorreta) {

                const corretaTexto =
                    questao.respostaCorreta;

                respostaCorreta.textContent =
                    corretaTexto === null ||
                    corretaTexto === undefined ||
                    String(corretaTexto).trim() === ""
                        ? "-"
                        : String(corretaTexto);

            }


            listaCorrecao.appendChild(
                fragmento
            );

        }
    );

}


/* =====================================================
   MOSTRAR RESULTADO
===================================================== */

function mostrarResultado(
    resultado
) {

    const total =
        Number(
            resultado.total || 0
        );

    const corretas =
        Number(
            resultado.corretas || 0
        );

    const erradas =
        Number(
            resultado.erradas || 0
        );

    const porcentagem =
        Number(
            resultado.porcentagem || 0
        );


    if (resultadoPorcentagem) {

        resultadoPorcentagem.textContent =
            `${porcentagem}%`;

    }


    if (resultadoTotal) {

        resultadoTotal.textContent =
            total;

    }


    if (resultadoCorretas) {

        resultadoCorretas.textContent =
            corretas;

    }


    if (resultadoErradas) {

        resultadoErradas.textContent =
            erradas;

    }


    renderizarCorrecao(
        resultado
    );


    resultadoExercicio?.classList.remove(
        "escondido"
    );


    areaFinalizar?.classList.add(
        "escondido"
    );


    bloquearQuestoes();


    setTimeout(
        () => {

            resultadoExercicio?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );

}


/* =====================================================
   FINALIZAR NO BACKEND
===================================================== */

async function finalizarExercicio() {

    if (
        finalizado ||
        enviando
    ) {
        return;
    }


    fecharModal();


    enviando = true;


    const respostas =
        obterRespostas();


    if (btnFinalizar) {

        btnFinalizar.disabled =
            true;

        btnFinalizar.textContent =
            "Corrigindo...";

    }


    if (btnFinalizarLateral) {

        btnFinalizarLateral.disabled =
            true;

        btnFinalizarLateral.textContent =
            "Corrigindo...";

    }


    if (btnConfirmarFinalizacao) {

        btnConfirmarFinalizacao.disabled =
            true;

    }


    try {

        const resposta =
            await fetch(
                `/api/aluno/exercicios/${encodeURIComponent(
                    exercicioId
                )}/finalizar`,
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
                                usuario.id,

                            respostas
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
                "Não foi possível corrigir o exercício."
            );

        }


        if (!dados.resultado) {

            throw new Error(
                "O servidor não retornou o resultado do exercício."
            );

        }


        finalizado = true;


        mostrarResultado(
            dados.resultado
        );


        mostrarToast(
            "Exercício corrigido com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro ao finalizar exercício:",
            erro
        );


        mostrarToast(
            erro.message ||
            "Erro ao finalizar exercício."
        );


        if (btnFinalizar) {

            btnFinalizar.disabled =
                false;

            btnFinalizar.textContent =
                "Finalizar exercício";

        }


        if (btnFinalizarLateral) {

            btnFinalizarLateral.disabled =
                false;

            btnFinalizarLateral.textContent =
                "Finalizar exercício";

        }


    } finally {

        enviando = false;


        if (btnConfirmarFinalizacao) {

            btnConfirmarFinalizacao.disabled =
                false;

        }

    }

}


/* =====================================================
   REFAZER
===================================================== */

function refazerExercicio() {

    finalizado = false;
    enviando = false;


    exercicioApp?.classList.remove(
        "exercicio-finalizado"
    );


    resultadoExercicio?.classList.add(
        "escondido"
    );


    areaFinalizar?.classList.remove(
        "escondido"
    );


    document
        .querySelectorAll(
            ".alternativa-input"
        )
        .forEach(
            input => {

                input.checked = false;
                input.disabled = false;

            }
        );


    document
        .querySelectorAll(
            ".resposta-escrita"
        )
        .forEach(
            campo => {

                campo.value = "";
                campo.disabled = false;

            }
        );


    if (btnFinalizar) {

        btnFinalizar.disabled =
            false;

        btnFinalizar.textContent =
            "Finalizar exercício";

    }


    if (btnFinalizarLateral) {

        btnFinalizarLateral.disabled =
            false;

        btnFinalizarLateral.textContent =
            "Finalizar exercício";

    }


    atualizarProgresso();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   EVENTOS
===================================================== */

btnVoltar?.addEventListener(
    "click",
    voltarParaAula
);


btnErroVoltar?.addEventListener(
    "click",
    voltarParaAula
);


btnVoltarAulaResultado?.addEventListener(
    "click",
    voltarParaAula
);


btnFinalizar?.addEventListener(
    "click",
    solicitarFinalizacao
);


btnFinalizarLateral?.addEventListener(
    "click",
    solicitarFinalizacao
);


btnCancelarFinalizacao?.addEventListener(
    "click",
    fecharModal
);


btnConfirmarFinalizacao?.addEventListener(
    "click",
    finalizarExercicio
);


btnRefazer?.addEventListener(
    "click",
    refazerExercicio
);


modalFinalizar?.addEventListener(
    "click",
    evento => {

        if (
            evento.target ===
            modalFinalizar
        ) {

            fecharModal();

        }

    }
);


document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            !modalFinalizar?.classList.contains(
                "escondido"
            )
        ) {

            fecharModal();

        }

    }
);


/* =====================================================
   INICIAR
===================================================== */

usuario =
    carregarUsuario();


if (usuario) {

    renderizarAvatar();

    carregarExercicio();

}