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

    const planoEl = document.getElementById("plano-aluno-topo");
    if (planoEl) {
        planoEl.textContent = dadosUsuario.plano || "Gratuito";
    }

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


function renderizarCronogramaEDiagnostico(dashboard) {
    const container = document.getElementById("card-cronograma-container");
    if (!container) return;

    const cronograma = dashboard.cronogramaSemanal;
    const diagnostico = dashboard.diagnostico;

    if (cronograma && Array.isArray(cronograma) && cronograma.length > 0) {
        const nivel = diagnostico?.nivel || "Intermediário";
        const score = diagnostico?.percentualGeral || 0;
        const foco = diagnostico?.foco ? diagnostico.foco.toUpperCase() : "GERAL";

        container.innerHTML = `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
                    <div>
                        <span style="font-size: 0.75rem; background: #ede9fe; color: #6d28d9; padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 700;">TRILHA PERSONALIZADA • ${foco}</span>
                        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-top: 0.4rem;">Meu Cronograma da Semana</h2>
                        <p style="font-size: 0.85rem; color: #64748b;">Nível ${nivel} (${score}% no diagnóstico) • Prioridade nas suas maiores lacunas</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <a href="/diagnostico.html" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.5rem 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
                            Refazer Diagnóstico ↻
                        </a>
                        <a href="/redacao.html" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.5rem 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; background: #7c3aed; color: #fff; border-radius: 6px;">
                            Laboratório de Redação ✎
                        </a>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                    ${cronograma.map(dia => `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #7c3aed; border-radius: 8px; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="font-size: 0.85rem; color: #0f172a;">${dia.dia}</strong>
                                <small style="font-size: 0.75rem; color: #6d28d9; font-weight: 600;">~${dia.tempoEstimadoMin} min</small>
                            </div>
                            <div style="font-size: 0.8rem; font-weight: 600; color: #4c1d95; margin-bottom: 0.5rem;">${dia.foco}</div>
                            <ul style="padding-left: 1.1rem; margin: 0; font-size: 0.75rem; color: #64748b; line-height: 1.4;">
                                ${(dia.atividades || []).map(act => `<li>${act}</li>`).join("")}
                            </ul>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #ddd6fe; border-radius: 12px; padding: 1.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); margin-bottom: 1.5rem;">
                <div style="max-width: 580px;">
                    <span style="font-size: 0.75rem; background: #7c3aed; color: #ffffff; padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 700;">ONBOARDING RECOMENDADO</span>
                    <h2 style="font-size: 1.3rem; font-weight: 700; color: #2e1065; margin-top: 0.4rem;">Diagnóstico e Trilha Personalizada com a Profª Wilma</h2>
                    <p style="font-size: 0.9rem; color: #5b21b6; margin-top: 0.25rem; line-height: 1.5;">
                        Responda ao teste rápido de nivelamento (10 questões) para identificarmos seus pontos fortes, lacunas em sintaxe e interpretação, e montarmos sua grade semanal sob medida.
                    </p>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <a href="/diagnostico.html" style="background: #7c3aed; color: #ffffff; font-weight: 600; padding: 0.75rem 1.4rem; border-radius: 8px; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 6px rgba(124,58,237,0.3);">
                        Iniciar Diagnóstico Gratuito →
                    </a>
                    <a href="/redacao.html" style="background: #ffffff; color: #6d28d9; border: 1px solid #ddd6fe; font-weight: 600; padding: 0.75rem 1.2rem; border-radius: 8px; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.4rem;">
                        Laboratório de Redação ✎
                    </a>
                </div>
            </div>
        `;
    }
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

        renderizarCronogramaEDiagnostico(
            dashboard
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

const btnNavDiag = document.getElementById("btn-nav-diagnostico");
if (btnNavDiag) {
    btnNavDiag.addEventListener("click", () => {
        window.location.href = "/diagnostico.html";
    });
}

const btnNavRed = document.getElementById("btn-nav-redacao");
if (btnNavRed) {
    btnNavRed.addEventListener("click", () => {
        window.location.href = "/redacao.html";
    });
}

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