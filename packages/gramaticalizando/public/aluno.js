/* =========================================
   ÁREA DO ALUNO
========================================= */


/* =========================================
   USUÁRIO SALVO
========================================= */

const usuarioSalvo =
    localStorage.getItem(
        "usuarioGramaticalizando"
    );


if (!usuarioSalvo) {

    window.location.href = "/";

}


/* =========================================
   CONVERTER USUÁRIO
========================================= */

let usuario = null;


try {

    usuario =
        JSON.parse(
            usuarioSalvo
        );

} catch (erro) {

    localStorage.removeItem(
        "usuarioGramaticalizando"
    );

    window.location.href = "/";

}


/* =========================================
   VERIFICAR ID
========================================= */

if (
    !usuario ||
    !usuario.id
) {

    localStorage.removeItem(
        "usuarioGramaticalizando"
    );

    window.location.href = "/";

}


/* =========================================
   ELEMENTOS DO USUÁRIO
========================================= */

const nomeAluno =
    document.getElementById(
        "nome-aluno"
    );

const nomeTopo =
    document.getElementById(
        "nome-topo"
    );

const avatarTopo =
    document.getElementById(
        "avatar-topo"
    );


/* =========================================
   ESTATÍSTICAS
========================================= */

const totalAulas =
    document.getElementById(
        "total-aulas"
    );

const totalExercicios =
    document.getElementById(
        "total-exercicios"
    );

const taxaAcerto =
    document.getElementById(
        "taxa-acerto"
    );

const trilhasAtivas =
    document.getElementById(
        "trilhas-ativas"
    );

const sequenciaEstudos =
    document.getElementById(
        "sequencia-estudos"
    );


/* =========================================
   CURSOS
========================================= */

const areaCursos =
    document.getElementById(
        "area-cursos"
    );

const btnExplorarCursos =
    document.getElementById(
        "btn-explorar-cursos"
    );


/* =========================================
   ATIVIDADES
========================================= */

const listaAtividades =
    document.getElementById(
        "lista-atividades"
    );


/* =========================================
   MENU
========================================= */

const btnSair =
    document.getElementById(
        "btn-sair"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const btnMenuMobile =
    document.getElementById(
        "btn-menu-mobile"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebar-overlay"
    );

const menuItems =
    document.querySelectorAll(
        ".menu-item[data-pagina]"
    );


/* =========================================
   PRIMEIRO NOME
========================================= */

function pegarPrimeiroNome(
    nome
) {

    if (!nome) {

        return "Aluno";

    }


    return nome
        .trim()
        .split(/\s+/)[0];

}


/* =========================================
   INICIAIS
========================================= */

function pegarIniciais(
    nome
) {

    if (!nome) {

        return "A";

    }


    const partes =
        nome
            .trim()
            .split(/\s+/);


    if (
        partes.length === 1
    ) {

        return partes[0]
            .charAt(0)
            .toUpperCase();

    }


    return (
        partes[0].charAt(0) +
        partes[
            partes.length - 1
        ].charAt(0)
    ).toUpperCase();

}


/* =========================================
   ESCAPAR HTML
========================================= */

function escaparHTML(
    texto
) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.textContent =
        texto || "";


    return elemento.innerHTML;

}


/* =========================================
   MOSTRAR USUÁRIO
========================================= */

function mostrarUsuario(
    dadosUsuario
) {

    nomeAluno.textContent =
        pegarPrimeiroNome(
            dadosUsuario.nome
        );


    nomeTopo.textContent =
        dadosUsuario.nome ||
        "Aluno";


    avatarTopo.textContent =
        pegarIniciais(
            dadosUsuario.nome
        );

}


/* =========================================
   ZERAR DASHBOARD
========================================= */

function zerarDashboard() {

    totalAulas.textContent =
        "0";

    totalExercicios.textContent =
        "0";

    taxaAcerto.textContent =
        "0%";

    trilhasAtivas.textContent =
        "0";

    sequenciaEstudos.textContent =
        "0 dias";

}


/* =========================================
   RENDERIZAR CURSOS
========================================= */

function renderizarCursos(
    cursos
) {

    areaCursos.innerHTML = "";


    if (
        !Array.isArray(cursos) ||
        cursos.length === 0
    ) {

        const vazio =
            document.createElement(
                "article"
            );


        vazio.className =
            "continuar-card";


        vazio.innerHTML = `

            <div class="card-cabecalho">

                <div>

                    <span class="section-label">
                        Nenhum conteúdo publicado
                    </span>

                    <h2>
                        Ainda não há aulas disponíveis
                    </h2>

                </div>

            </div>


            <p
                style="
                    margin-top: 12px;
                    color: #6b6b75;
                    font-size: 11px;
                    line-height: 1.6;
                "
            >
                Quando uma aula for publicada pelo professor,
                ela aparecerá aqui automaticamente.
            </p>

        `;


        areaCursos.appendChild(vazio);

        return;
    }


    cursos.forEach(
        curso => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "continuar-card";


            const nomeCurso =
                escaparHTML(
                    curso.nome ||
                    "Matéria"
                );


            const aulas =
                Array.isArray(curso.aulas)
                    ? curso.aulas
                    : [];


            const progressoOriginal =
                Number(
                    curso.progresso
                );


            const progresso =
                Number.isFinite(
                    progressoOriginal
                )
                    ? Math.max(
                        0,
                        Math.min(
                            100,
                            progressoOriginal
                        )
                    )
                    : 0;


            const totalAulas =
                Number(
                    curso.totalAulas
                ) || aulas.length;


            card.innerHTML = `

                <div class="card-cabecalho">

                    <div>

                        <span class="section-label">
                            Conteúdo disponível
                        </span>

                        <h2>
                            ${nomeCurso}
                        </h2>

                        <p
                            style="
                                margin-top: 6px;
                                color: #6b6b75;
                                font-size: 11px;
                            "
                        >
                            ${totalAulas}
                            ${totalAulas === 1 ? "aula publicada" : "aulas publicadas"}
                        </p>

                    </div>

                </div>


                <div
                    class="progresso-info"
                    style="margin-top: 22px;"
                >

                    <span>
                        Progresso
                    </span>

                    <strong>
                        ${progresso}%
                    </strong>

                </div>


                <div class="barra-progresso">

                    <div
                        class="barra-preenchida"
                        style="width: ${progresso}%;"
                    ></div>

                </div>


                <button
                    class="btn-continuar btn-ver-aulas"
                    type="button"
                    style="margin-top: 18px;"
                >
                    Ver aulas
                    <span>→</span>
                </button>


                <div
                    class="lista-aulas-publicadas"
                    style="
                        display: none;
                        margin-top: 18px;
                    "
                ></div>

            `;


            const btnVerAulas =
                card.querySelector(
                    ".btn-ver-aulas"
                );


            const listaAulas =
                card.querySelector(
                    ".lista-aulas-publicadas"
                );


            aulas.forEach(
                (aula, indice) => {

                    const itemAula =
                        document.createElement(
                            "div"
                        );


                    itemAula.style.cssText = `
                        border-top: 1px solid #ececf2;
                        padding: 16px 0;
                    `;


                    const titulo =
                        escaparHTML(
                            aula.titulo ||
                            `Aula ${indice + 1}`
                        );


                    itemAula.innerHTML = `

                        <button
                            type="button"
                            class="abrir-conteudo-aula"
                            style="
                                width: 100%;
                                border: 0;
                                background: transparent;
                                padding: 0;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                gap: 12px;
                                cursor: pointer;
                                text-align: left;
                                color: inherit;
                            "
                        >

                            <strong>
                                ${indice + 1}. ${titulo}
                            </strong>

                            <span>
                                +
                            </span>

                        </button>


                        <div
                            class="conteudo-aula-publicada"
                            style="
                                display: none;
                                margin-top: 16px;
                                color: #444451;
                                line-height: 1.7;
                                font-size: 14px;
                            "
                        ></div>

                    `;


                    const btnAbrir =
                        itemAula.querySelector(
                            ".abrir-conteudo-aula"
                        );


                    const conteudo =
                        itemAula.querySelector(
                            ".conteudo-aula-publicada"
                        );


                    /*
                        O conteúdo foi criado pelo próprio
                        administrador no editor da plataforma.
                        Por isso preservamos a formatação HTML.
                    */
                    conteudo.innerHTML =
                        aula.conteudo || "";


                    btnAbrir.addEventListener(
                        "click",
                        function () {

                            const aberto =
                                conteudo.style.display !==
                                "none";


                            conteudo.style.display =
                                aberto
                                    ? "none"
                                    : "block";


                            const icone =
                                btnAbrir.querySelector(
                                    "span"
                                );


                            if (icone) {

                                icone.textContent =
                                    aberto
                                        ? "+"
                                        : "−";
                            }
                        }
                    );


                    listaAulas.appendChild(
                        itemAula
                    );
                }
            );


            btnVerAulas.addEventListener(
                "click",
                function () {

                    const aberto =
                        listaAulas.style.display !==
                        "none";


                    listaAulas.style.display =
                        aberto
                            ? "none"
                            : "block";


                    btnVerAulas.innerHTML =
                        aberto
                            ? "Ver aulas <span>→</span>"
                            : "Fechar aulas <span>↑</span>";
                }
            );


            areaCursos.appendChild(
                card
            );
        }
    );
}


/* =========================================
   RENDERIZAR ATIVIDADES
========================================= */

function renderizarAtividades(
    atividades
) {

    if (
        !Array.isArray(atividades) ||
        atividades.length === 0
    ) {

        return;

    }


    listaAtividades.innerHTML =
        "";


    atividades.forEach(
        atividade => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "atividade-item";


            const titulo =
                escaparHTML(
                    atividade.titulo ||
                    "Atividade"
                );


            const descricao =
                escaparHTML(
                    atividade.descricao ||
                    ""
                );


            const data =
                escaparHTML(
                    atividade.data ||
                    ""
                );


            item.innerHTML = `

                <div class="atividade-icone">
                    ✓
                </div>


                <div>

                    <strong>
                        ${titulo}
                    </strong>

                    <span>
                        ${descricao}
                    </span>

                </div>


                <small>
                    ${data}
                </small>

            `;


            listaAtividades.appendChild(
                item
            );

        }
    );

}


/* =========================================
   CARREGAR DADOS REAIS DO SERVIDOR
========================================= */

async function carregarDashboard() {

    zerarDashboard();


    try {

        const resposta =
            await fetch(
                `/api/dashboard/${usuario.id}`
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar dashboard."
            );

        }


        const dashboard =
            dados.dashboard;


        if (
            !dashboard
        ) {

            throw new Error(
                "Dashboard inválido."
            );

        }


        /* =================================
           USUÁRIO
        ================================== */

        if (
            dashboard.usuario
        ) {

            usuario =
                dashboard.usuario;


            localStorage.setItem(
                "usuarioGramaticalizando",
                JSON.stringify(
                    usuario
                )
            );


            mostrarUsuario(
                usuario
            );

        }


        /* =================================
           ESTATÍSTICAS
        ================================== */

        const estatisticas =
            dashboard.estatisticas ||
            {};


        const aulas =
            Number(
                estatisticas.aulasConcluidas
            ) || 0;


        const exercicios =
            Number(
                estatisticas.exerciciosFeitos
            ) || 0;


        const acertos =
            Number(
                estatisticas.taxaAcerto
            ) || 0;


        const trilhas =
            Number(
                estatisticas.trilhasAtivas
            ) || 0;


        const sequencia =
            Number(
                estatisticas.sequencia
            ) || 0;


        totalAulas.textContent =
            aulas;


        totalExercicios.textContent =
            exercicios;


        taxaAcerto.textContent =
            `${acertos}%`;


        trilhasAtivas.textContent =
            trilhas;


        sequenciaEstudos.textContent =
            sequencia === 1
                ?
                "1 dia"
                :
                `${sequencia} dias`;


        /* =================================
           CURSOS
        ================================== */

        renderizarCursos(
            dashboard.cursos
        );


        /* =================================
           ATIVIDADES
        ================================== */

        renderizarAtividades(
            dashboard.atividades
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );


        /*
            Em caso de erro nós NÃO
            inventamos nenhum dado.

            Mantém tudo zerado.
        */

        zerarDashboard();

    }

}


/* =========================================
   MOSTRAR NOME LOCAL ENQUANTO CARREGA
========================================= */

mostrarUsuario(
    usuario
);


/* =========================================
   LOGOUT
========================================= */

btnSair.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "usuarioGramaticalizando"
        );


        window.location.href =
            "/";

    }
);


/* =========================================
   SIDEBAR MOBILE
========================================= */

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


btnMenuMobile.addEventListener(
    "click",
    function () {

        if (
            sidebar.classList.contains(
                "aberta"
            )
        ) {

            fecharSidebar();

        } else {

            abrirSidebar();

        }

    }
);


sidebarOverlay.addEventListener(
    "click",
    fecharSidebar
);


/* =========================================
   MENU
========================================= */

menuItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function () {

                const pagina =
                    item.dataset.pagina;


                if (
                    pagina ===
                    "inicio"
                ) {

                    window.location.href =
                        "/aluno.html";

                    return;

                }


                if (
                    pagina ===
                    "exercicios"
                ) {

                    window.location.href =
                        "/exercicios.html";

                    return;

                }


                console.log(
                    "Página ainda não criada:",
                    pagina
                );


                if (
                    window.innerWidth <=
                    850
                ) {

                    fecharSidebar();

                }

            }
        );

    }
);

/* =========================================
   EXPLORAR CURSOS
========================================= */

if (
    btnExplorarCursos
) {

    btnExplorarCursos.addEventListener(
        "click",
        function () {

            areaCursos.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


/* =========================================
   INICIAR
========================================= */

carregarDashboard();