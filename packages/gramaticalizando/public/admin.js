/* =====================================================
   ELEMENTOS GERAIS
===================================================== */

const paginas =
    document.querySelectorAll(".pagina");

const menuItens =
    document.querySelectorAll(".menu-item");

const tituloPagina =
    document.getElementById("titulo-pagina");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebar-overlay");

const btnMenuMobile =
    document.getElementById("btn-menu-mobile");

const btnSair =
    document.getElementById("btn-sair");


/* =====================================================
   ADMIN
===================================================== */

const adminNomeTopo =
    document.getElementById("admin-nome-topo");

const adminNomeSidebar =
    document.getElementById("admin-nome-sidebar");

const adminAvatarTopo =
    document.getElementById("admin-avatar-topo");

const adminAvatarSidebar =
    document.getElementById("admin-avatar-sidebar");


/* =====================================================
   DASHBOARD
===================================================== */

const totalAlunos =
    document.getElementById("total-alunos");

const totalMaterias =
    document.getElementById("total-materias");

const aulasPublicadas =
    document.getElementById("aulas-publicadas");

const aulasRascunho =
    document.getElementById("aulas-rascunho");

const exerciciosPublicados =
    document.getElementById("exercicios-publicados");

const exerciciosRascunho =
    document.getElementById("exercicios-rascunho");


const btnHeroNovaMateria =
    document.getElementById(
        "btn-hero-nova-materia"
    );

const btnHeroNovoExercicio =
    document.getElementById(
        "btn-hero-novo-exercicio"
    );

const btnVerMaterias =
    document.getElementById(
        "btn-ver-materias"
    );

const btnVerExercicios =
    document.getElementById(
        "btn-ver-exercicios"
    );


/* =====================================================
   MATÉRIAS
===================================================== */

const btnNovaMateria =
    document.getElementById(
        "btn-nova-materia"
    );

const btnPrimeiraMateria =
    document.getElementById(
        "btn-primeira-materia"
    );

const estadoMaterias =
    document.getElementById(
        "estado-materias"
    );

const listaMaterias =
    document.getElementById(
        "lista-materias"
    );


/* =====================================================
   AULAS
===================================================== */

const btnVoltarMaterias =
    document.getElementById(
        "btn-voltar-materias"
    );

const nomeMateriaAulas =
    document.getElementById(
        "nome-materia-aulas"
    );

const btnNovaAula =
    document.getElementById(
        "btn-nova-aula"
    );

const btnPrimeiraAula =
    document.getElementById(
        "btn-primeira-aula"
    );

const estadoAulas =
    document.getElementById(
        "estado-aulas"
    );

const listaAulas =
    document.getElementById(
        "lista-aulas"
    );


/* =====================================================
   EXERCÍCIOS
===================================================== */

const btnNovoExercicio =
    document.getElementById(
        "btn-novo-exercicio"
    );

const btnPrimeiroExercicio =
    document.getElementById(
        "btn-primeiro-exercicio"
    );

const estadoExercicios =
    document.getElementById(
        "estado-exercicios"
    );

const listaExercicios =
    document.getElementById(
        "lista-exercicios"
    );

const resumoExerciciosPublicados =
    document.getElementById(
        "resumo-exercicios-publicados"
    );

const resumoExerciciosRascunho =
    document.getElementById(
        "resumo-exercicios-rascunho"
    );

const resumoExerciciosTotal =
    document.getElementById(
        "resumo-exercicios-total"
    );


/* =====================================================
   ALUNOS
===================================================== */

const tabelaAlunos =
    document.getElementById(
        "tabela-alunos"
    );

const estadoAlunos =
    document.getElementById(
        "estado-alunos"
    );


/* =====================================================
   MODAL MATÉRIA
===================================================== */

const modalMateria =
    document.getElementById(
        "modal-materia"
    );

const modalMateriaTitulo =
    document.getElementById(
        "modal-materia-titulo"
    );

const btnFecharModalMateria =
    document.getElementById(
        "btn-fechar-modal-materia"
    );

const btnCancelarMateria =
    document.getElementById(
        "btn-cancelar-materia"
    );

const formMateria =
    document.getElementById(
        "form-materia"
    );

const materiaId =
    document.getElementById(
        "materia-id"
    );

const materiaNome =
    document.getElementById(
        "materia-nome"
    );

const mensagemMateria =
    document.getElementById(
        "mensagem-materia"
    );

const btnSalvarMateria =
    document.getElementById(
        "btn-salvar-materia"
    );


/* =====================================================
   ESTADO
===================================================== */

let materiaAtual = null;


/* =====================================================
   AUXILIARES
===================================================== */

function iniciais(nome = "") {

    const partes =
        String(nome)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (!partes.length) {

        return "A";

    }


    if (partes.length === 1) {

        return partes[0]
            .slice(0, 2)
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[
            partes.length - 1
        ][0]
    ).toUpperCase();

}


function formatarData(data) {

    if (!data) {

        return "-";

    }


    const objeto =
        new Date(data);


    if (
        Number.isNaN(
            objeto.getTime()
        )
    ) {

        return "-";

    }


    return objeto
        .toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


function escaparHtml(valor = "") {

    return String(valor)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function abrirPagina(
    nome,
    alterarMenu = true
) {

    paginas.forEach(
        pagina => {

            pagina.classList.remove(
                "ativa"
            );

        }
    );


    const pagina =
        document.getElementById(
            `pagina-${nome}`
        );


    if (pagina) {

        pagina.classList.add(
            "ativa"
        );

    }


    const titulos = {
        dashboard:
            "Dashboard",

        materias:
            "Matérias",

        aulas:
            "Aulas",

        exercicios:
            "Exercícios",

        alunos:
            "Alunos"
    };


    tituloPagina.textContent =
        titulos[nome] ||
        "Administração";


    if (alterarMenu) {

        menuItens.forEach(
            item => {

                item.classList.toggle(
                    "ativo",

                    item.dataset.pagina ===
                    nome
                );

            }
        );

    }


    /*
        A página "Aulas" fica dentro
        de Matérias no menu.
    */

    if (nome === "aulas") {

        menuItens.forEach(
            item => {

                item.classList.toggle(
                    "ativo",

                    item.dataset.pagina ===
                    "materias"
                );

            }
        );

    }


    fecharSidebar();

}


menuItens.forEach(
    item => {

        item.addEventListener(
            "click",

            () => {

                const pagina =
                    item.dataset.pagina;


                abrirPagina(
                    pagina
                );


                if (
                    pagina ===
                    "dashboard"
                ) {

                    carregarDashboard();

                }


                if (
                    pagina ===
                    "materias"
                ) {

                    carregarMaterias();

                }


                if (
                    pagina ===
                    "exercicios"
                ) {

                    carregarExercicios();

                }


                if (
                    pagina ===
                    "alunos"
                ) {

                    carregarAlunos();

                }

            }
        );

    }
);


/* =====================================================
   SIDEBAR MOBILE
===================================================== */

function abrirSidebar() {

    sidebar.classList.add(
        "aberta"
    );

    sidebarOverlay.classList.add(
        "ativo"
    );

}


function fecharSidebar() {

    sidebar.classList.remove(
        "aberta"
    );

    sidebarOverlay.classList.remove(
        "ativo"
    );

}


if (btnMenuMobile) {

    btnMenuMobile.addEventListener(
        "click",
        abrirSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        fecharSidebar
    );

}


/* =====================================================
   SESSÃO ADMIN
===================================================== */

async function verificarSessao() {

    try {

        const resposta =
            await fetch(
                "/api/admin/me"
            );


        if (!resposta.ok) {

            window.location.href =
                "/admin-login.html";

            return;

        }


        const dados =
            await resposta.json();


        if (
            !dados.sucesso ||
            !dados.usuario
        ) {

            window.location.href =
                "/admin-login.html";

            return;

        }


        const nome =
            dados.usuario.nome ||
            "Administrador";


        adminNomeTopo.textContent =
            nome;

        adminNomeSidebar.textContent =
            nome;


        const avatar =
            iniciais(nome);


        adminAvatarTopo.textContent =
            avatar;

        adminAvatarSidebar.textContent =
            avatar;


        await Promise.all([
            carregarDashboard(),
            carregarMaterias()
        ]);


        const params =
            new URLSearchParams(
                window.location.search
            );


        const materiaIdUrl =
            params.get(
                "materia"
            );


        if (materiaIdUrl) {

            await abrirMateriaPorId(
                materiaIdUrl
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao verificar sessão:",
            erro
        );


        window.location.href =
            "/admin-login.html";

    }

}


if (btnSair) {

    btnSair.addEventListener(
        "click",

        async () => {

            try {

                await fetch(
                    "/api/admin/logout",
                    {
                        method:
                            "POST"
                    }
                );

            } catch (erro) {

                console.error(
                    erro
                );

            } finally {

                window.location.href =
                    "/admin-login.html";

            }

        }
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

async function carregarDashboard() {

    try {

        const resposta =
            await fetch(
                "/api/admin/dashboard"
            );


        if (!resposta.ok) {

            return;

        }


        const dados =
            await resposta.json();


        if (!dados.sucesso) {

            return;

        }


        const estatisticas =
            dados.estatisticas ||
            {};


        totalAlunos.textContent =
            estatisticas.alunos ??
            0;


        totalMaterias.textContent =
            estatisticas.materias ??
            0;


        aulasPublicadas.textContent =
            estatisticas
                .aulasPublicadas ??
            0;


        aulasRascunho.textContent =
            estatisticas
                .aulasRascunho ??
            0;


        if (
            exerciciosPublicados
        ) {

            exerciciosPublicados
                .textContent =
                    estatisticas
                        .exerciciosPublicados ??
                    0;

        }


        if (
            exerciciosRascunho
        ) {

            exerciciosRascunho
                .textContent =
                    estatisticas
                        .exerciciosRascunho ??
                    0;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


/* =====================================================
   BOTÕES DASHBOARD
===================================================== */

if (btnHeroNovaMateria) {

    btnHeroNovaMateria.addEventListener(
        "click",

        () => {

            abrirPagina(
                "materias"
            );

            abrirModalNovaMateria();

        }
    );

}


if (btnVerMaterias) {

    btnVerMaterias.addEventListener(
        "click",

        () => {

            abrirPagina(
                "materias"
            );

            carregarMaterias();

        }
    );

}


function abrirEditorNovoExercicio() {

    window.location.href =
        "/editor-exercicio.html";

}


if (btnHeroNovoExercicio) {

    btnHeroNovoExercicio.addEventListener(
        "click",
        abrirEditorNovoExercicio
    );

}


if (btnVerExercicios) {

    btnVerExercicios.addEventListener(
        "click",

        () => {

            abrirPagina(
                "exercicios"
            );

            carregarExercicios();

        }
    );

}


/* =====================================================
   MATÉRIA - MENSAGENS
===================================================== */

function mostrarMensagemMateria(
    texto,
    tipo = "erro"
) {

    mensagemMateria.textContent =
        texto;


    mensagemMateria.className =
        `form-message ${tipo}`;

}


function limparMensagemMateria() {

    mensagemMateria.textContent =
        "";

    mensagemMateria.className =
        "form-message";

}


/* =====================================================
   MODAL MATÉRIA
===================================================== */

function abrirModalNovaMateria() {

    materiaId.value =
        "";

    materiaNome.value =
        "";


    modalMateriaTitulo.textContent =
        "Nova matéria";


    btnSalvarMateria.textContent =
        "Criar matéria";


    limparMensagemMateria();


    modalMateria.classList.remove(
        "escondido"
    );


    setTimeout(
        () => {

            materiaNome.focus();

        },
        50
    );

}


function abrirModalEditarMateria(
    materia
) {

    materiaId.value =
        materia.id;

    materiaNome.value =
        materia.nome;


    modalMateriaTitulo.textContent =
        "Editar matéria";


    btnSalvarMateria.textContent =
        "Salvar alterações";


    limparMensagemMateria();


    modalMateria.classList.remove(
        "escondido"
    );


    setTimeout(
        () => {

            materiaNome.focus();

        },
        50
    );

}


function fecharModalMateria() {

    modalMateria.classList.add(
        "escondido"
    );


    materiaId.value =
        "";

    materiaNome.value =
        "";


    limparMensagemMateria();

}


if (btnNovaMateria) {

    btnNovaMateria.addEventListener(
        "click",
        abrirModalNovaMateria
    );

}


if (btnPrimeiraMateria) {

    btnPrimeiraMateria.addEventListener(
        "click",
        abrirModalNovaMateria
    );

}


if (btnFecharModalMateria) {

    btnFecharModalMateria
        .addEventListener(
            "click",
            fecharModalMateria
        );

}


if (btnCancelarMateria) {

    btnCancelarMateria
        .addEventListener(
            "click",
            fecharModalMateria
        );

}


if (modalMateria) {

    modalMateria.addEventListener(
        "click",

        evento => {

            if (
                evento.target ===
                modalMateria
            ) {

                fecharModalMateria();

            }

        }
    );

}


/* =====================================================
   RENDERIZAR MATÉRIAS
===================================================== */

function renderizarMaterias(
    materias
) {

    if (!materias.length) {

        estadoMaterias.classList.remove(
            "escondido"
        );


        listaMaterias.classList.add(
            "escondido"
        );


        listaMaterias.innerHTML =
            "";


        return;

    }


    estadoMaterias.classList.add(
        "escondido"
    );


    listaMaterias.classList.remove(
        "escondido"
    );


    listaMaterias.innerHTML =
        "";


    materias.forEach(
        materia => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "materia-item";


            const total =
                Number(
                    materia.totalAulas
                ) ||
                0;


            const publicadas =
                Number(
                    materia.aulasPublicadas
                ) ||
                0;


            item.innerHTML = `
                <div class="materia-info">

                    <div class="materia-icone">
                        ${escaparHtml(
                            materia.nome
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </div>

                    <div class="materia-texto">

                        <strong>
                            ${escaparHtml(
                                materia.nome
                            )}
                        </strong>

                        <span>
                            ${total}
                            aula${total === 1 ? "" : "s"}
                            ·
                            ${publicadas}
                            publicada${publicadas === 1 ? "" : "s"}
                        </span>

                    </div>

                </div>

                <div class="materia-acoes">

                    <button
                        type="button"
                        class="btn btn-small btn-abrir"
                        data-acao="abrir"
                    >
                        Abrir
                    </button>

                    <button
                        type="button"
                        class="btn btn-small btn-editar"
                        data-acao="editar"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn btn-small btn-excluir"
                        data-acao="excluir"
                    >
                        Excluir
                    </button>

                </div>
            `;


            item
                .querySelector(
                    '[data-acao="abrir"]'
                )
                .addEventListener(
                    "click",

                    () =>
                        abrirMateria(
                            materia
                        )
                );


            item
                .querySelector(
                    '[data-acao="editar"]'
                )
                .addEventListener(
                    "click",

                    () =>
                        abrirModalEditarMateria(
                            materia
                        )
                );


            item
                .querySelector(
                    '[data-acao="excluir"]'
                )
                .addEventListener(
                    "click",

                    () =>
                        excluirMateria(
                            materia
                        )
                );


            listaMaterias.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   CARREGAR MATÉRIAS
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


        renderizarMaterias(
            dados.materias ||
            []
        );


        return dados.materias ||
            [];


    } catch (erro) {

        console.error(
            "Erro ao carregar matérias:",
            erro
        );


        return [];

    }

}


/* =====================================================
   SALVAR MATÉRIA
===================================================== */

if (formMateria) {

    formMateria.addEventListener(
        "submit",

        async evento => {

            evento.preventDefault();


            limparMensagemMateria();


            const nome =
                materiaNome
                    .value
                    .trim();


            if (
                nome.length <
                2
            ) {

                mostrarMensagemMateria(
                    "Digite um nome válido para a matéria."
                );

                return;

            }


            const id =
                materiaId.value;


            const editando =
                Boolean(id);


            btnSalvarMateria.disabled =
                true;


            btnSalvarMateria.textContent =
                editando
                    ?
                    "Salvando..."
                    :
                    "Criando...";


            try {

                const resposta =
                    await fetch(
                        editando
                            ?
                            `/api/admin/materias/${id}`
                            :
                            "/api/admin/materias",

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
                                JSON.stringify({
                                    nome
                                })
                        }
                    );


                const dados =
                    await resposta.json();


                if (
                    !resposta.ok ||
                    !dados.sucesso
                ) {

                    mostrarMensagemMateria(
                        dados.mensagem ||
                        "Não foi possível salvar a matéria."
                    );

                    return;

                }


                fecharModalMateria();


                await Promise.all([
                    carregarMaterias(),
                    carregarDashboard()
                ]);


            } catch (erro) {

                console.error(
                    erro
                );


                mostrarMensagemMateria(
                    "Erro de conexão com o servidor."
                );


            } finally {

                btnSalvarMateria.disabled =
                    false;


                btnSalvarMateria.textContent =
                    editando
                        ?
                        "Salvar alterações"
                        :
                        "Criar matéria";

            }

        }
    );

}


/* =====================================================
   EXCLUIR MATÉRIA
===================================================== */

async function excluirMateria(
    materia
) {

    const confirmar =
        window.confirm(
            `Excluir a matéria "${materia.nome}"?\n\nEssa ação não pode ser desfeita.`
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `/api/admin/materias/${materia.id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            alert(
                dados.mensagem ||
                "Não foi possível excluir a matéria."
            );

            return;

        }


        await Promise.all([
            carregarMaterias(),
            carregarDashboard()
        ]);


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

}


/* =====================================================
   AULAS
===================================================== */

function abrirMateria(
    materia
) {

    materiaAtual =
        materia;


    nomeMateriaAulas.textContent =
        materia.nome;


    abrirPagina(
        "aulas",
        false
    );


    carregarAulas();

}


async function abrirMateriaPorId(
    id
) {

    const materias =
        await carregarMaterias();


    const materia =
        materias.find(
            item =>
                item.id ===
                id
        );


    if (!materia) {

        return;

    }


    abrirMateria(
        materia
    );

}


if (btnVoltarMaterias) {

    btnVoltarMaterias.addEventListener(
        "click",

        () => {

            materiaAtual =
                null;


            abrirPagina(
                "materias"
            );


            carregarMaterias();


            history.replaceState(
                {},
                "",
                "/admin.html"
            );

        }
    );

}


/* =====================================================
   ABRIR EDITOR DE AULA
===================================================== */

function abrirEditorNovaAula() {

    if (
        !materiaAtual?.id
    ) {

        alert(
            "Nenhuma matéria foi selecionada."
        );

        return;

    }


    window.location.href =
        `/editor-aula.html?materia=${encodeURIComponent(
            materiaAtual.id
        )}`;

}


if (btnNovaAula) {

    btnNovaAula.addEventListener(
        "click",
        abrirEditorNovaAula
    );

}


if (btnPrimeiraAula) {

    btnPrimeiraAula.addEventListener(
        "click",
        abrirEditorNovaAula
    );

}


/* =====================================================
   RENDERIZAR AULAS
===================================================== */

function renderizarAulas(
    aulas
) {

    if (!aulas.length) {

        estadoAulas.classList.remove(
            "escondido"
        );


        listaAulas.classList.add(
            "escondido"
        );


        listaAulas.innerHTML =
            "";


        return;

    }


    estadoAulas.classList.add(
        "escondido"
    );


    listaAulas.classList.remove(
        "escondido"
    );


    listaAulas.innerHTML =
        "";


    aulas.forEach(
        (
            aula,
            indice
        ) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "aula-item";


            item.innerHTML = `
                <div class="aula-info">

                    <div class="aula-numero">
                        ${String(
                            indice + 1
                        ).padStart(
                            2,
                            "0"
                        )}
                    </div>

                    <div class="aula-texto">

                        <strong class="aula-titulo">
                            ${escaparHtml(
                                aula.titulo
                            )}
                        </strong>

                        <div class="aula-meta">

                            <span
                                class="
                                    status-aula
                                    ${
                                        aula.publicado
                                            ?
                                            "status-publicada"
                                            :
                                            "status-rascunho"
                                    }
                                "
                            >
                                ${
                                    aula.publicado
                                        ?
                                        "Publicada"
                                        :
                                        "Rascunho"
                                }
                            </span>

                            <span>
                                Atualizada em
                                ${formatarData(
                                    aula.atualizadoEm
                                )}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="aula-acoes">

                    <button
                        type="button"
                        class="btn btn-small btn-editar"
                        data-acao="editar"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn btn-small btn-excluir"
                        data-acao="excluir"
                    >
                        Excluir
                    </button>

                </div>
            `;


            item
                .querySelector(
                    '[data-acao="editar"]'
                )
                .addEventListener(
                    "click",

                    () => {

                        window.location.href =
                            `/editor-aula.html?id=${encodeURIComponent(
                                aula.id
                            )}`;

                    }
                );


            item
                .querySelector(
                    '[data-acao="excluir"]'
                )
                .addEventListener(
                    "click",

                    () =>
                        excluirAula(
                            aula
                        )
                );


            listaAulas.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   CARREGAR AULAS
===================================================== */

async function carregarAulas() {

    if (
        !materiaAtual?.id
    ) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `/api/admin/materias/${materiaAtual.id}/aulas`
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


        if (dados.materia) {

            materiaAtual =
                dados.materia;


            nomeMateriaAulas.textContent =
                dados.materia.nome;

        }


        renderizarAulas(
            dados.aulas ||
            []
        );


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível carregar as aulas."
        );

    }

}


/* =====================================================
   EXCLUIR AULA
===================================================== */

async function excluirAula(
    aula
) {

    const confirmar =
        window.confirm(
            `Excluir a aula "${aula.titulo}"?\n\nEssa ação não pode ser desfeita.`
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `/api/admin/aulas/${aula.id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            alert(
                dados.mensagem ||
                "Não foi possível excluir a aula."
            );

            return;

        }


        await Promise.all([
            carregarAulas(),
            carregarMaterias(),
            carregarDashboard()
        ]);


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

}


/* =====================================================
   EXERCÍCIOS - BOTÕES
===================================================== */

if (btnNovoExercicio) {

    btnNovoExercicio.addEventListener(
        "click",
        abrirEditorNovoExercicio
    );

}


if (btnPrimeiroExercicio) {

    btnPrimeiroExercicio
        .addEventListener(
            "click",
            abrirEditorNovoExercicio
        );

}


/* =====================================================
   RENDERIZAR EXERCÍCIOS
===================================================== */

function renderizarExercicios(
    exercicios
) {

    const total =
        exercicios.length;


    const publicados =
        exercicios.filter(
            exercicio =>
                exercicio.publicado ===
                true
        ).length;


    const rascunhos =
        total -
        publicados;


    if (
        resumoExerciciosPublicados
    ) {

        resumoExerciciosPublicados
            .textContent =
                publicados;

    }


    if (
        resumoExerciciosRascunho
    ) {

        resumoExerciciosRascunho
            .textContent =
                rascunhos;

    }


    if (
        resumoExerciciosTotal
    ) {

        resumoExerciciosTotal
            .textContent =
                total;

    }


    if (!exercicios.length) {

        estadoExercicios.classList.remove(
            "escondido"
        );


        listaExercicios.classList.add(
            "escondido"
        );


        listaExercicios.innerHTML =
            "";


        return;

    }


    estadoExercicios.classList.add(
        "escondido"
    );


    listaExercicios.classList.remove(
        "escondido"
    );


    listaExercicios.innerHTML =
        "";


    exercicios.forEach(
        exercicio => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "exercicio-item";


            const materiaNome =
                exercicio.materia?.nome ||
                "Matéria removida";


            const aulaTitulo =
                exercicio.aula?.titulo ||
                "Aula removida";


            const totalQuestoes =
                Number(
                    exercicio.totalQuestoes ??
                    exercicio.questoes?.length
                ) ||
                0;


            item.innerHTML = `
                <div class="exercicio-info">

                    <div class="exercicio-icone">
                        ?
                    </div>

                    <div class="exercicio-texto">

                        <div class="exercicio-topo">

                            <strong class="exercicio-titulo">
                                ${escaparHtml(
                                    exercicio.titulo
                                )}
                            </strong>

                            <span
                                class="
                                    status-aula
                                    ${
                                        exercicio.publicado
                                            ?
                                            "status-publicada"
                                            :
                                            "status-rascunho"
                                    }
                                "
                            >
                                ${
                                    exercicio.publicado
                                        ?
                                        "Publicado"
                                        :
                                        "Rascunho"
                                }
                            </span>

                        </div>

                        <div class="exercicio-vinculo">
                            <span>
                                ${escaparHtml(
                                    materiaNome
                                )}
                            </span>

                            <span class="exercicio-seta">
                                →
                            </span>

                            <span>
                                ${escaparHtml(
                                    aulaTitulo
                                )}
                            </span>
                        </div>

                        <div class="exercicio-meta">

                            <span>
                                ${totalQuestoes}
                                questão${totalQuestoes === 1 ? "" : "ões"}
                            </span>

                            <span>
                                Atualizado em
                                ${formatarData(
                                    exercicio.atualizadoEm
                                )}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="exercicio-acoes">

                    <button
                        type="button"
                        class="btn btn-small btn-editar"
                        data-acao="editar"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn btn-small btn-excluir"
                        data-acao="excluir"
                    >
                        Excluir
                    </button>

                </div>
            `;


            item
                .querySelector(
                    '[data-acao="editar"]'
                )
                .addEventListener(
                    "click",

                    () => {

                        window.location.href =
                            `/editor-exercicio.html?id=${encodeURIComponent(
                                exercicio.id
                            )}`;

                    }
                );


            item
                .querySelector(
                    '[data-acao="excluir"]'
                )
                .addEventListener(
                    "click",

                    () =>
                        excluirExercicio(
                            exercicio
                        )
                );


            listaExercicios.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   CARREGAR EXERCÍCIOS
===================================================== */

async function carregarExercicios() {

    try {

        const resposta =
            await fetch(
                "/api/admin/exercicios"
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar exercícios."
            );

        }


        renderizarExercicios(
            dados.exercicios ||
            []
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar exercícios:",
            erro
        );


        alert(
            "Não foi possível carregar os exercícios."
        );

    }

}


/* =====================================================
   EXCLUIR EXERCÍCIO
===================================================== */

async function excluirExercicio(
    exercicio
) {

    const confirmar =
        window.confirm(
            `Excluir o exercício "${exercicio.titulo}"?\n\nTodas as questões desta lista serão removidas. Essa ação não pode ser desfeita.`
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `/api/admin/exercicios/${exercicio.id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            alert(
                dados.mensagem ||
                "Não foi possível excluir o exercício."
            );

            return;

        }


        await Promise.all([
            carregarExercicios(),
            carregarDashboard()
        ]);


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

}


/* =====================================================
   ALUNOS
===================================================== */

async function carregarAlunos() {

    try {

        const resposta =
            await fetch(
                "/api/admin/alunos"
            );


        const dados =
            await resposta.json();


        if (
            !resposta.ok ||
            !dados.sucesso
        ) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar alunos."
            );

        }


        const alunos =
            dados.alunos ||
            [];


        tabelaAlunos.innerHTML =
            "";


        if (!alunos.length) {

            estadoAlunos.classList.remove(
                "escondido"
            );

            return;

        }


        estadoAlunos.classList.add(
            "escondido"
        );


        alunos.forEach(
            aluno => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `
                    <td>

                        <div class="aluno-tabela-info">

                            <div class="aluno-tabela-avatar">
                                ${escaparHtml(
                                    iniciais(
                                        aluno.nome
                                    )
                                )}
                            </div>

                            <strong>
                                ${escaparHtml(
                                    aluno.nome
                                )}
                            </strong>

                        </div>

                    </td>

                    <td>
                        ${escaparHtml(
                            aluno.email
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            aluno.criadoEm
                        )}
                    </td>
                `;


                tabelaAlunos.appendChild(
                    tr
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar alunos:",
            erro
        );

    }

}


/* =====================================================
   TECLA ESC
===================================================== */

document.addEventListener(
    "keydown",

    evento => {

        if (
            evento.key ===
            "Escape"
        ) {

            fecharSidebar();


            if (
                modalMateria &&
                !modalMateria.classList.contains(
                    "escondido"
                )
            ) {

                fecharModalMateria();

            }

        }

    }
);


/* =====================================================
   INICIAR
===================================================== */

verificarSessao();