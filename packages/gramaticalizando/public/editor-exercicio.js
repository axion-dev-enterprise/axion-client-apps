/* =====================================================
   PARÂMETROS DA URL
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

let exercicioId =
    params.get("id");


/* =====================================================
   ELEMENTOS
===================================================== */

const btnVoltar =
    document.getElementById(
        "btn-voltar"
    );

const tituloTopo =
    document.getElementById(
        "titulo-topo"
    );

const statusSalvamento =
    document.getElementById(
        "status-salvamento"
    );

const btnSalvarRascunho =
    document.getElementById(
        "btn-salvar-rascunho"
    );

const btnPublicar =
    document.getElementById(
        "btn-publicar"
    );


const exercicioTitulo =
    document.getElementById(
        "exercicio-titulo"
    );

const exercicioDescricao =
    document.getElementById(
        "exercicio-descricao"
    );

const materiaSelect =
    document.getElementById(
        "materia-select"
    );

const aulaSelect =
    document.getElementById(
        "aula-select"
    );


const btnAdicionarQuestao =
    document.getElementById(
        "btn-adicionar-questao"
    );

const btnPrimeiraQuestao =
    document.getElementById(
        "btn-primeira-questao"
    );

const questoesVazio =
    document.getElementById(
        "questoes-vazio"
    );

const listaQuestoes =
    document.getElementById(
        "lista-questoes"
    );


const resumoTotalQuestoes =
    document.getElementById(
        "resumo-total-questoes"
    );

const resumoMultipla =
    document.getElementById(
        "resumo-multipla"
    );

const resumoEscrita =
    document.getElementById(
        "resumo-escrita"
    );


const statusExercicio =
    document.getElementById(
        "status-exercicio"
    );


const templateQuestao =
    document.getElementById(
        "template-questao"
    );

const templateAlternativa =
    document.getElementById(
        "template-alternativa"
    );

const templateRespostaAceita =
    document.getElementById(
        "template-resposta-aceita"
    );


const toast =
    document.getElementById(
        "toast"
    );

const toastMensagem =
    document.getElementById(
        "toast-mensagem"
    );


/* =====================================================
   ESTADO
===================================================== */

let materias = [];

let publicadoAtual = false;

let salvando = false;

let toastTimer = null;


/* =====================================================
   AUXILIARES
===================================================== */

function gerarId() {

    if (
        typeof crypto !==
            "undefined" &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now()
            .toString(36) +
        Math.random()
            .toString(36)
            .slice(2)
    );

}


function mostrarToast(
    mensagem,
    tipo = ""
) {

    clearTimeout(
        toastTimer
    );


    toastMensagem.textContent =
        mensagem;


    toast.className =
        "toast";


    if (tipo) {

        toast.classList.add(
            tipo
        );

    }


    toast.classList.remove(
        "escondido"
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.add(
                    "escondido"
                );

            },
            3500
        );

}


function definirStatusSalvamento(
    texto
) {

    statusSalvamento.textContent =
        texto;

}


function atualizarStatusPublicacao(
    publicado
) {

    publicadoAtual =
        Boolean(publicado);


    statusExercicio.classList.remove(
        "status-publicado",
        "status-rascunho"
    );


    if (publicadoAtual) {

        statusExercicio.classList.add(
            "status-publicado"
        );


        statusExercicio.textContent =
            "Publicado";


        btnPublicar.textContent =
            "Atualizar publicação";

    } else {

        statusExercicio.classList.add(
            "status-rascunho"
        );


        statusExercicio.textContent =
            "Rascunho";


        btnPublicar.textContent =
            "Publicar";

    }

}


function marcarAlterado() {

    definirStatusSalvamento(
        "Alterações não salvas"
    );

}


/* =====================================================
   VOLTAR
===================================================== */

btnVoltar.addEventListener(
    "click",
    () => {

        window.location.href =
            "/admin.html";

    }
);


/* =====================================================
   MATÉRIAS
===================================================== */

async function carregarMaterias() {

    try {

        const resposta =
            await fetch(
                "/api/admin/materias"
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar matérias."
            );

        }


        materias =
            dados.materias || [];


        materiaSelect.innerHTML = `
            <option value="">
                Selecione uma matéria
            </option>
        `;


        materias.forEach(
            materia => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    materia.id;


                option.textContent =
                    materia.nome;


                materiaSelect.appendChild(
                    option
                );

            }
        );


    } catch (erro) {

        console.error(
            erro
        );


        mostrarToast(
            "Não foi possível carregar as matérias.",
            "erro"
        );

    }

}


/* =====================================================
   AULAS DA MATÉRIA
===================================================== */

async function carregarAulas(
    materiaId,
    aulaSelecionada = ""
) {

    aulaSelect.disabled =
        true;


    aulaSelect.innerHTML = `
        <option value="">
            Carregando aulas...
        </option>
    `;


    if (!materiaId) {

        aulaSelect.innerHTML = `
            <option value="">
                Selecione uma matéria primeiro
            </option>
        `;


        return;

    }


    try {

        const resposta =
            await fetch(
                `/api/admin/materias/${encodeURIComponent(
                    materiaId
                )}/aulas`
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar aulas."
            );

        }


        const aulas =
            dados.aulas || [];


        aulaSelect.innerHTML = `
            <option value="">
                Selecione uma aula
            </option>
        `;


        aulas.forEach(
            aula => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    aula.id;


                option.textContent =
                    aula.titulo;


                aulaSelect.appendChild(
                    option
                );

            }
        );


        aulaSelect.disabled =
            false;


        if (aulaSelecionada) {

            aulaSelect.value =
                aulaSelecionada;

        }


        if (!aulas.length) {

            aulaSelect.innerHTML = `
                <option value="">
                    Esta matéria ainda não possui aulas
                </option>
            `;


            aulaSelect.disabled =
                true;

        }


    } catch (erro) {

        console.error(
            erro
        );


        aulaSelect.innerHTML = `
            <option value="">
                Erro ao carregar aulas
            </option>
        `;


        mostrarToast(
            "Não foi possível carregar as aulas.",
            "erro"
        );

    }

}


materiaSelect.addEventListener(
    "change",
    async () => {

        await carregarAulas(
            materiaSelect.value
        );


        marcarAlterado();

    }
);


aulaSelect.addEventListener(
    "change",
    marcarAlterado
);


exercicioTitulo.addEventListener(
    "input",
    marcarAlterado
);


exercicioDescricao.addEventListener(
    "input",
    marcarAlterado
);


/* =====================================================
   QUESTÕES - RESUMO
===================================================== */

function atualizarResumo() {

    const cards =
        [
            ...listaQuestoes
                .querySelectorAll(
                    ".questao-card"
                )
        ];


    let multipla = 0;
    let escrita = 0;


    cards.forEach(
        card => {

            const tipo =
                card.querySelector(
                    ".questao-tipo"
                ).value;


            if (
                tipo ===
                "multipla-escolha"
            ) {

                multipla++;

            } else {

                escrita++;

            }

        }
    );


    resumoTotalQuestoes.textContent =
        cards.length;


    resumoMultipla.textContent =
        multipla;


    resumoEscrita.textContent =
        escrita;


    if (cards.length) {

        questoesVazio.classList.add(
            "escondido"
        );


        listaQuestoes.classList.remove(
            "escondido"
        );

    } else {

        questoesVazio.classList.remove(
            "escondido"
        );


        listaQuestoes.classList.add(
            "escondido"
        );

    }


    atualizarNumeracaoQuestoes();

}


/* =====================================================
   NUMERAÇÃO
===================================================== */

function atualizarNumeracaoQuestoes() {

    const cards =
        listaQuestoes.querySelectorAll(
            ".questao-card"
        );


    cards.forEach(
        (
            card,
            indice
        ) => {

            const numero =
                indice + 1;


            card
                .querySelector(
                    ".questao-numero"
                )
                .textContent =
                    String(
                        numero
                    ).padStart(
                        2,
                        "0"
                    );


            card
                .querySelector(
                    ".questao-identificacao h3"
                )
                .textContent =
                    `Questão ${numero}`;


            const radios =
                card.querySelectorAll(
                    ".alternativa-correta"
                );


            radios.forEach(
                radio => {

                    radio.name =
                        `correta-${card.dataset.questaoId}`;

                }
            );

        }
    );

}


/* =====================================================
   LETRAS DAS ALTERNATIVAS
===================================================== */

function letraAlternativa(
    indice
) {

    return String.fromCharCode(
        65 + indice
    );

}


function atualizarLetrasAlternativas(
    card
) {

    const alternativas =
        card.querySelectorAll(
            ".alternativa-item"
        );


    alternativas.forEach(
        (
            item,
            indice
        ) => {

            item
                .querySelector(
                    ".alternativa-letra"
                )
                .textContent =
                    letraAlternativa(
                        indice
                    );

        }
    );

}


/* =====================================================
   CRIAR ALTERNATIVA
===================================================== */

function adicionarAlternativa(
    card,
    dados = null
) {

    const lista =
        card.querySelector(
            ".lista-alternativas"
        );


    const fragmento =
        templateAlternativa
            .content
            .cloneNode(
                true
            );


    const item =
        fragmento.querySelector(
            ".alternativa-item"
        );


    const radio =
        item.querySelector(
            ".alternativa-correta"
        );


    const input =
        item.querySelector(
            ".alternativa-texto"
        );


    const btnRemover =
        item.querySelector(
            ".btn-remover-alternativa"
        );


    const id =
        dados?.id ||
        gerarId();


    item.dataset.alternativaId =
        id;


    radio.name =
        `correta-${card.dataset.questaoId}`;


    radio.value =
        id;


    if (dados) {

        input.value =
            dados.texto || "";


        radio.checked =
            Boolean(
                dados.correta
            );

    }


    input.addEventListener(
        "input",
        marcarAlterado
    );


    radio.addEventListener(
        "change",
        marcarAlterado
    );


    btnRemover.addEventListener(
        "click",
        () => {

            const total =
                lista.querySelectorAll(
                    ".alternativa-item"
                ).length;


            if (total <= 2) {

                mostrarToast(
                    "Uma questão de múltipla escolha precisa ter pelo menos 2 alternativas.",
                    "erro"
                );

                return;

            }


            item.remove();


            atualizarLetrasAlternativas(
                card
            );


            marcarAlterado();

        }
    );


    lista.appendChild(
        fragmento
    );


    atualizarLetrasAlternativas(
        card
    );

}


/* =====================================================
   RESPOSTAS ACEITAS
===================================================== */

function adicionarRespostaAceita(
    card,
    valor = ""
) {

    const lista =
        card.querySelector(
            ".lista-respostas-aceitas"
        );


    const fragmento =
        templateRespostaAceita
            .content
            .cloneNode(
                true
            );


    const item =
        fragmento.querySelector(
            ".resposta-aceita-item"
        );


    const input =
        item.querySelector(
            ".resposta-aceita-texto"
        );


    const btnRemover =
        item.querySelector(
            ".btn-remover-resposta"
        );


    input.value =
        valor;


    input.addEventListener(
        "input",
        marcarAlterado
    );


    btnRemover.addEventListener(
        "click",
        () => {

            const total =
                lista.querySelectorAll(
                    ".resposta-aceita-item"
                ).length;


            if (total <= 1) {

                mostrarToast(
                    "Adicione pelo menos uma resposta aceita.",
                    "erro"
                );

                return;

            }


            item.remove();


            marcarAlterado();

        }
    );


    lista.appendChild(
        fragmento
    );

}


/* =====================================================
   TROCAR TIPO DA QUESTÃO
===================================================== */

function atualizarTipoQuestao(
    card
) {

    const tipo =
        card.querySelector(
            ".questao-tipo"
        ).value;


    const areaMultipla =
        card.querySelector(
            ".area-multipla-escolha"
        );


    const areaEscrita =
        card.querySelector(
            ".area-resposta-escrita"
        );


    if (
        tipo ===
        "multipla-escolha"
    ) {

        areaMultipla.classList.remove(
            "escondido"
        );


        areaEscrita.classList.add(
            "escondido"
        );


        const alternativas =
            card.querySelectorAll(
                ".alternativa-item"
            );


        if (!alternativas.length) {

            for (
                let i = 0;
                i < 4;
                i++
            ) {

                adicionarAlternativa(
                    card
                );

            }

        }


    } else {

        areaMultipla.classList.add(
            "escondido"
        );


        areaEscrita.classList.remove(
            "escondido"
        );


        const respostas =
            card.querySelectorAll(
                ".resposta-aceita-item"
            );


        if (!respostas.length) {

            adicionarRespostaAceita(
                card
            );

        }

    }


    atualizarResumo();

}


/* =====================================================
   CRIAR QUESTÃO
===================================================== */

function adicionarQuestao(
    dados = null
) {

    const fragmento =
        templateQuestao
            .content
            .cloneNode(
                true
            );


    const card =
        fragmento.querySelector(
            ".questao-card"
        );


    const id =
        dados?.id ||
        gerarId();


    card.dataset.questaoId =
        id;


    const tipoSelect =
        card.querySelector(
            ".questao-tipo"
        );


    const enunciado =
        card.querySelector(
            ".questao-enunciado"
        );


    const btnAdicionarAlternativa =
        card.querySelector(
            ".btn-adicionar-alternativa"
        );


    const btnAdicionarResposta =
        card.querySelector(
            ".btn-adicionar-resposta"
        );


    const btnRemover =
        card.querySelector(
            ".btn-remover"
        );


    const btnSubir =
        card.querySelector(
            ".btn-subir"
        );


    const btnDescer =
        card.querySelector(
            ".btn-descer"
        );


    if (dados) {

        tipoSelect.value =
            dados.tipo ||
            "multipla-escolha";


        enunciado.value =
            dados.enunciado ||
            "";

    }


    tipoSelect.addEventListener(
        "change",
        () => {

            atualizarTipoQuestao(
                card
            );


            marcarAlterado();

        }
    );


    enunciado.addEventListener(
        "input",
        marcarAlterado
    );


    btnAdicionarAlternativa
        .addEventListener(
            "click",
            () => {

                const quantidade =
                    card.querySelectorAll(
                        ".alternativa-item"
                    ).length;


                if (
                    quantidade >=
                    10
                ) {

                    mostrarToast(
                        "O máximo é 10 alternativas por questão.",
                        "erro"
                    );

                    return;

                }


                adicionarAlternativa(
                    card
                );


                marcarAlterado();

            }
        );


    btnAdicionarResposta
        .addEventListener(
            "click",
            () => {

                adicionarRespostaAceita(
                    card
                );


                marcarAlterado();

            }
        );


    btnRemover.addEventListener(
        "click",
        () => {

            const confirmar =
                window.confirm(
                    "Remover esta questão?"
                );


            if (!confirmar) {

                return;

            }


            card.remove();


            atualizarResumo();


            marcarAlterado();

        }
    );


    btnSubir.addEventListener(
        "click",
        () => {

            const anterior =
                card.previousElementSibling;


            if (anterior) {

                listaQuestoes.insertBefore(
                    card,
                    anterior
                );


                atualizarResumo();


                marcarAlterado();

            }

        }
    );


    btnDescer.addEventListener(
        "click",
        () => {

            const proximo =
                card.nextElementSibling;


            if (proximo) {

                listaQuestoes.insertBefore(
                    proximo,
                    card
                );


                atualizarResumo();


                marcarAlterado();

            }

        }
    );


    listaQuestoes.appendChild(
        fragmento
    );


    /*
        Carrega as respostas
        existentes quando está editando.
    */

    if (dados) {

        if (
            dados.tipo ===
            "resposta-escrita"
        ) {

            const respostas =
                Array.isArray(
                    dados.respostasAceitas
                )
                    ?
                    dados.respostasAceitas
                    :
                    [];


            respostas.forEach(
                resposta => {

                    adicionarRespostaAceita(
                        card,
                        resposta
                    );

                }
            );


            if (!respostas.length) {

                adicionarRespostaAceita(
                    card
                );

            }


        } else {

            const alternativas =
                Array.isArray(
                    dados.alternativas
                )
                    ?
                    dados.alternativas
                    :
                    [];


            alternativas.forEach(
                alternativa => {

                    adicionarAlternativa(
                        card,
                        {
                            id:
                                alternativa.id,

                            texto:
                                alternativa.texto,

                            correta:
                                alternativa.id ===
                                dados.respostaCorreta
                        }
                    );

                }
            );


            if (!alternativas.length) {

                for (
                    let i = 0;
                    i < 4;
                    i++
                ) {

                    adicionarAlternativa(
                        card
                    );

                }

            }

        }


    } else {

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            adicionarAlternativa(
                card
            );

        }

    }


    atualizarTipoQuestao(
        card
    );


    atualizarResumo();


    setTimeout(
        () => {

            card
                .querySelector(
                    ".questao-enunciado"
                )
                .focus();

        },
        50
    );

}


/* =====================================================
   BOTÕES DE QUESTÃO
===================================================== */

btnAdicionarQuestao.addEventListener(
    "click",
    () => {

        adicionarQuestao();


        marcarAlterado();

    }
);


btnPrimeiraQuestao.addEventListener(
    "click",
    () => {

        adicionarQuestao();


        marcarAlterado();

    }
);


/* =====================================================
   EXTRAIR QUESTÕES DA TELA
===================================================== */

function obterQuestoes() {

    const cards =
        [
            ...listaQuestoes
                .querySelectorAll(
                    ".questao-card"
                )
        ];


    return cards.map(
        card => {

            const id =
                card.dataset.questaoId;


            const tipo =
                card.querySelector(
                    ".questao-tipo"
                ).value;


            const enunciado =
                card.querySelector(
                    ".questao-enunciado"
                )
                .value
                .trim();


            if (
                tipo ===
                "multipla-escolha"
            ) {

                const itens =
                    [
                        ...card.querySelectorAll(
                            ".alternativa-item"
                        )
                    ];


                const alternativas =
                    itens.map(
                        item => ({
                            id:
                                item.dataset
                                    .alternativaId,

                            texto:
                                item
                                    .querySelector(
                                        ".alternativa-texto"
                                    )
                                    .value
                                    .trim()
                        })
                    );


                const marcada =
                    card.querySelector(
                        ".alternativa-correta:checked"
                    );


                return {
                    id,
                    tipo,
                    enunciado,
                    alternativas,
                    respostaCorreta:
                        marcada
                            ?
                            marcada.value
                            :
                            ""
                };

            }


            const respostasAceitas =
                [
                    ...card.querySelectorAll(
                        ".resposta-aceita-texto"
                    )
                ]
                    .map(
                        input =>
                            input
                                .value
                                .trim()
                    )
                    .filter(
                        Boolean
                    );


            return {
                id,
                tipo,
                enunciado,
                respostasAceitas
            };

        }
    );

}


/* =====================================================
   VALIDAÇÃO
===================================================== */

function validarExercicio(
    questoes
) {

    const titulo =
        exercicioTitulo
            .value
            .trim();


    if (
        titulo.length <
        3
    ) {

        return (
            "Digite um título válido para o exercício."
        );

    }


    if (
        !materiaSelect.value
    ) {

        return (
            "Selecione uma matéria."
        );

    }


    if (
        !aulaSelect.value
    ) {

        return (
            "Selecione uma aula."
        );

    }


    if (!questoes.length) {

        return (
            "Adicione pelo menos uma questão."
        );

    }


    for (
        let i = 0;
        i < questoes.length;
        i++
    ) {

        const questao =
            questoes[i];


        const numero =
            i + 1;


        if (
            questao.enunciado.length <
            2
        ) {

            return (
                `Digite o enunciado da questão ${numero}.`
            );

        }


        if (
            questao.tipo ===
            "multipla-escolha"
        ) {

            if (
                questao.alternativas.length <
                2
            ) {

                return (
                    `A questão ${numero} precisa ter pelo menos duas alternativas.`
                );

            }


            const vazia =
                questao.alternativas.some(
                    alternativa =>
                        !alternativa.texto
                );


            if (vazia) {

                return (
                    `Preencha todas as alternativas da questão ${numero}.`
                );

            }


            if (
                !questao.respostaCorreta
            ) {

                return (
                    `Marque a resposta correta da questão ${numero}.`
                );

            }

        }


        if (
            questao.tipo ===
            "resposta-escrita"
        ) {

            if (
                !questao
                    .respostasAceitas
                    .length
            ) {

                return (
                    `Adicione pelo menos uma resposta aceita na questão ${numero}.`
                );

            }

        }

    }


    return null;

}


/* =====================================================
   MONTAR PAYLOAD
===================================================== */

function montarDados(
    publicado
) {

    const questoes =
        obterQuestoes();


    const erro =
        validarExercicio(
            questoes
        );


    if (erro) {

        throw new Error(
            erro
        );

    }


    return {
        titulo:
            exercicioTitulo
                .value
                .trim(),

        descricao:
            exercicioDescricao
                .value
                .trim(),

        materiaId:
            materiaSelect.value,

        aulaId:
            aulaSelect.value,

        publicado:
            Boolean(
                publicado
            ),

        questoes
    };

}


/* =====================================================
   SALVAR
===================================================== */

async function salvarExercicio(
    publicar
) {

    if (salvando) {

        return;

    }


    let payload;


    try {

        payload =
            montarDados(
                publicar
            );


    } catch (erro) {

        mostrarToast(
            erro.message,
            "erro"
        );


        return;

    }


    salvando =
        true;


    btnSalvarRascunho.disabled =
        true;

    btnPublicar.disabled =
        true;


    definirStatusSalvamento(
        "Salvando..."
    );


    const editando =
        Boolean(
            exercicioId
        );


    try {

        const resposta =
            await fetch(
                editando
                    ?
                    `/api/admin/exercicios/${encodeURIComponent(
                        exercicioId
                    )}`
                    :
                    "/api/admin/exercicios",

                {
                    method:
                        editando
                            ?
                            "PUT"
                            :
                            "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
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
                "Não foi possível salvar o exercício."
            );

        }


        const exercicioSalvo =
            dados.exercicio;


        /*
            No primeiro POST recebemos
            o ID e passamos a editar
            o mesmo exercício.
        */

        if (
            !exercicioId &&
            exercicioSalvo?.id
        ) {

            exercicioId =
                exercicioSalvo.id;


            history.replaceState(
                {},
                "",
                `/editor-exercicio.html?id=${encodeURIComponent(
                    exercicioId
                )}`
            );

        }


        tituloTopo.textContent =
            exercicioSalvo?.titulo ||
            payload.titulo;


        atualizarStatusPublicacao(
            payload.publicado
        );


        definirStatusSalvamento(
            "Salvo"
        );


        mostrarToast(
            payload.publicado
                ?
                "Exercício publicado com sucesso."
                :
                "Rascunho salvo com sucesso.",
            "sucesso"
        );


    } catch (erro) {

        console.error(
            erro
        );


        definirStatusSalvamento(
            "Erro ao salvar"
        );


        mostrarToast(
            erro.message ||
            "Erro ao salvar exercício.",
            "erro"
        );


    } finally {

        salvando =
            false;


        btnSalvarRascunho.disabled =
            false;

        btnPublicar.disabled =
            false;

    }

}


/* =====================================================
   SALVAR RASCUNHO
===================================================== */

btnSalvarRascunho.addEventListener(
    "click",
    () => {

        salvarExercicio(
            false
        );

    }
);


/* =====================================================
   PUBLICAR
===================================================== */

btnPublicar.addEventListener(
    "click",
    () => {

        salvarExercicio(
            true
        );

    }
);


/* =====================================================
   CARREGAR EXERCÍCIO EXISTENTE
===================================================== */

async function carregarExercicio() {

    if (!exercicioId) {

        tituloTopo.textContent =
            "Novo exercício";


        atualizarStatusPublicacao(
            false
        );


        atualizarResumo();


        return;

    }


    definirStatusSalvamento(
        "Carregando..."
    );


    try {

        const resposta =
            await fetch(
                `/api/admin/exercicios/${encodeURIComponent(
                    exercicioId
                )}`
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso ||
            !dados.exercicio
        ) {

            throw new Error(
                dados.mensagem ||
                "Exercício não encontrado."
            );

        }


        const exercicio =
            dados.exercicio;


        tituloTopo.textContent =
            exercicio.titulo ||
            "Editar exercício";


        exercicioTitulo.value =
            exercicio.titulo ||
            "";


        exercicioDescricao.value =
            exercicio.descricao ||
            "";


        materiaSelect.value =
            exercicio.materiaId ||
            "";


        await carregarAulas(
            exercicio.materiaId,
            exercicio.aulaId
        );


        listaQuestoes.innerHTML =
            "";


        const questoes =
            Array.isArray(
                exercicio.questoes
            )
                ?
                exercicio.questoes
                :
                [];


        questoes.forEach(
            questao => {

                adicionarQuestao(
                    questao
                );

            }
        );


        atualizarStatusPublicacao(
            exercicio.publicado
        );


        atualizarResumo();


        definirStatusSalvamento(
            "Salvo"
        );


    } catch (erro) {

        console.error(
            erro
        );


        definirStatusSalvamento(
            "Erro ao carregar"
        );


        mostrarToast(
            erro.message ||
            "Não foi possível carregar o exercício.",
            "erro"
        );

    }

}


/* =====================================================
   AVISO AO SAIR COM ALTERAÇÕES
===================================================== */

window.addEventListener(
    "beforeunload",
    evento => {

        if (
            statusSalvamento.textContent ===
            "Alterações não salvas"
        ) {

            evento.preventDefault();

            evento.returnValue =
                "";

        }

    }
);


/* =====================================================
   INICIAR
===================================================== */

async function iniciar() {

    await carregarMaterias();

    await carregarExercicio();

}


iniciar();