const usuarioSalvo = localStorage.getItem("usuarioGramaticalizando");

let usuario = null;
let exercicios = [];
let exerciciosFiltrados = [];

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const btnMenuMobile = document.getElementById("btn-menu-mobile");

const nomeTopo = document.getElementById("nome-topo");
const avatarTopo = document.getElementById("avatar-topo");

const filtroMateria = document.getElementById("filtro-materia");
const filtroAula = document.getElementById("filtro-aula");
const btnLimparFiltros = document.getElementById("btn-limpar-filtros");

const estadoCarregando = document.getElementById("estado-carregando");
const estadoErro = document.getElementById("estado-erro");
const estadoVazio = document.getElementById("estado-vazio");
const mensagemErro = document.getElementById("mensagem-erro");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");

const areaExercicios = document.getElementById("area-exercicios");
const listaExercicios = document.getElementById("lista-exercicios");
const totalExercicios = document.getElementById("total-exercicios");

const templateExercicio = document.getElementById("template-exercicio");

const btnInicio = document.getElementById("btn-inicio");
const btnCursos = document.getElementById("btn-cursos");
const btnTrilhas = document.getElementById("btn-trilhas");
const btnProgresso = document.getElementById("btn-progresso");
const btnPerfil = document.getElementById("btn-perfil");
const btnSair = document.getElementById("btn-sair");


/* =====================================
   USUÁRIO
===================================== */

function carregarUsuario() {
    if (!usuarioSalvo) {
        window.location.href = "/";
        return false;
    }

    try {
        usuario = JSON.parse(usuarioSalvo);
    } catch (erro) {
        localStorage.removeItem("usuarioGramaticalizando");
        window.location.href = "/";
        return false;
    }

    if (!usuario || !usuario.id) {
        localStorage.removeItem("usuarioGramaticalizando");
        window.location.href = "/";
        return false;
    }

    const nome =
        usuario.nome ||
        usuario.usuario ||
        usuario.email ||
        "Aluno";

    nomeTopo.textContent = nome;

    avatarTopo.textContent =
        String(nome)
            .trim()
            .charAt(0)
            .toUpperCase() || "A";

    return true;
}


/* =====================================
   ESTADOS DA TELA
===================================== */

function esconderEstados() {
    estadoCarregando.classList.add("escondido");
    estadoErro.classList.add("escondido");
    estadoVazio.classList.add("escondido");
    areaExercicios.classList.add("escondido");
}


function mostrarCarregando() {
    esconderEstados();

    estadoCarregando.classList.remove("escondido");
}


function mostrarErro(mensagem) {
    esconderEstados();

    mensagemErro.textContent =
        mensagem ||
        "Não foi possível carregar os exercícios.";

    estadoErro.classList.remove("escondido");
}


function mostrarVazio() {
    esconderEstados();

    estadoVazio.classList.remove("escondido");
}


function mostrarLista() {
    esconderEstados();

    areaExercicios.classList.remove("escondido");
}


/* =====================================
   AUXILIARES
===================================== */

function textoSeguro(valor, padrao = "") {
    const texto = String(valor ?? "").trim();

    return texto || padrao;
}


function quantidadeQuestoes(exercicio) {
    if (Array.isArray(exercicio.questoes)) {
        return exercicio.questoes.length;
    }

    const total = Number(
        exercicio.totalQuestoes ??
        exercicio.quantidadeQuestoes ??
        0
    );

    return Number.isFinite(total)
        ? total
        : 0;
}


function obterMateriaId(exercicio) {
    return String(
        exercicio.materiaId ??
        exercicio.materia?.id ??
        ""
    );
}


function obterMateriaNome(exercicio) {
    return textoSeguro(
        exercicio.materia?.nome ??
        exercicio.materiaNome,
        "Matéria"
    );
}


function obterAulaId(exercicio) {
    return String(
        exercicio.aulaId ??
        exercicio.aula?.id ??
        ""
    );
}


function obterAulaNome(exercicio) {
    return textoSeguro(
        exercicio.aula?.titulo ??
        exercicio.aulaTitulo,
        "Aula"
    );
}


/* =====================================
   CARREGAR EXERCÍCIOS
===================================== */

async function carregarExercicios() {
    mostrarCarregando();

    try {
        const resposta = await fetch(
            "/api/aluno/exercicios",
            {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            }
        );

        let dados;

        try {
            dados = await resposta.json();
        } catch (erro) {
            throw new Error(
                "O servidor retornou uma resposta inválida."
            );
        }

        if (!resposta.ok) {
            throw new Error(
                dados?.erro ||
                dados?.mensagem ||
                "Não foi possível buscar os exercícios."
            );
        }

        /*
         * Aceita alguns formatos para não quebrar
         * caso a rota devolva:
         *
         * [ ... ]
         *
         * ou:
         *
         * {
         *     sucesso: true,
         *     exercicios: [ ... ]
         * }
         */

        if (Array.isArray(dados)) {
            exercicios = dados;
        } else if (Array.isArray(dados?.exercicios)) {
            exercicios = dados.exercicios;
        } else {
            exercicios = [];
        }

        /*
         * O backend já deve devolver somente
         * exercícios publicados.
         *
         * Esta verificação é apenas uma proteção
         * adicional caso "publicado" venha no objeto.
         */

        exercicios = exercicios.filter((exercicio) => {
            if (
                Object.prototype.hasOwnProperty.call(
                    exercicio,
                    "publicado"
                )
            ) {
                return exercicio.publicado === true;
            }

            return true;
        });

        montarFiltros();

        aplicarFiltros();

    } catch (erro) {
        console.error(
            "Erro ao carregar exercícios:",
            erro
        );

        mostrarErro(
            erro.message ||
            "Não foi possível carregar os exercícios."
        );
    }
}


/* =====================================
   FILTRO DE MATÉRIAS
===================================== */

function montarFiltroMaterias() {
    const valorAtual = filtroMateria.value;

    const materias = new Map();

    exercicios.forEach((exercicio) => {
        const id = obterMateriaId(exercicio);

        if (!id) {
            return;
        }

        const nome = obterMateriaNome(exercicio);

        if (!materias.has(id)) {
            materias.set(id, nome);
        }
    });

    const lista = Array
        .from(materias.entries())
        .sort((a, b) => {
            return a[1].localeCompare(
                b[1],
                "pt-BR"
            );
        });

    filtroMateria.innerHTML = "";

    const opcaoTodas =
        document.createElement("option");

    opcaoTodas.value = "";
    opcaoTodas.textContent =
        "Todas as matérias";

    filtroMateria.appendChild(opcaoTodas);

    lista.forEach(([id, nome]) => {
        const option =
            document.createElement("option");

        option.value = id;
        option.textContent = nome;

        filtroMateria.appendChild(option);
    });

    if (
        valorAtual &&
        materias.has(valorAtual)
    ) {
        filtroMateria.value = valorAtual;
    }
}


/* =====================================
   FILTRO DE AULAS
===================================== */

function montarFiltroAulas() {
    const valorAtual = filtroAula.value;
    const materiaSelecionada =
        filtroMateria.value;

    const aulas = new Map();

    exercicios.forEach((exercicio) => {
        const materiaId =
            obterMateriaId(exercicio);

        if (
            materiaSelecionada &&
            materiaId !== materiaSelecionada
        ) {
            return;
        }

        const aulaId =
            obterAulaId(exercicio);

        if (!aulaId) {
            return;
        }

        const nome =
            obterAulaNome(exercicio);

        if (!aulas.has(aulaId)) {
            aulas.set(aulaId, nome);
        }
    });

    const lista = Array
        .from(aulas.entries())
        .sort((a, b) => {
            return a[1].localeCompare(
                b[1],
                "pt-BR"
            );
        });

    filtroAula.innerHTML = "";

    const opcaoTodas =
        document.createElement("option");

    opcaoTodas.value = "";
    opcaoTodas.textContent =
        "Todas as aulas";

    filtroAula.appendChild(opcaoTodas);

    lista.forEach(([id, nome]) => {
        const option =
            document.createElement("option");

        option.value = id;
        option.textContent = nome;

        filtroAula.appendChild(option);
    });

    if (
        valorAtual &&
        aulas.has(valorAtual)
    ) {
        filtroAula.value = valorAtual;
    }
}


function montarFiltros() {
    montarFiltroMaterias();
    montarFiltroAulas();
}


/* =====================================
   APLICAR FILTROS
===================================== */

function aplicarFiltros() {
    const materiaSelecionada =
        filtroMateria.value;

    const aulaSelecionada =
        filtroAula.value;

    exerciciosFiltrados =
        exercicios.filter((exercicio) => {
            const materiaId =
                obterMateriaId(exercicio);

            const aulaId =
                obterAulaId(exercicio);

            const passouMateria =
                !materiaSelecionada ||
                materiaId === materiaSelecionada;

            const passouAula =
                !aulaSelecionada ||
                aulaId === aulaSelecionada;

            return (
                passouMateria &&
                passouAula
            );
        });

    renderizarExercicios();
}


/* =====================================
   RENDERIZAR EXERCÍCIOS
===================================== */

function renderizarExercicios() {
    listaExercicios.innerHTML = "";

    const quantidade =
        exerciciosFiltrados.length;

    totalExercicios.textContent =
        quantidade === 1
            ? "1 exercício"
            : `${quantidade} exercícios`;

    if (quantidade === 0) {
        mostrarVazio();
        return;
    }

    mostrarLista();

    exerciciosFiltrados.forEach(
        (exercicio) => {
            const fragmento =
                templateExercicio
                    .content
                    .cloneNode(true);

            const card =
                fragmento.querySelector(
                    ".exercicio-card"
                );

            const materia =
                fragmento.querySelector(
                    ".exercicio-materia"
                );

            const titulo =
                fragmento.querySelector(
                    ".exercicio-titulo"
                );

            const aula =
                fragmento.querySelector(
                    ".exercicio-aula"
                );

            const descricao =
                fragmento.querySelector(
                    ".exercicio-descricao"
                );

            const questoes =
                fragmento.querySelector(
                    ".exercicio-questoes"
                );

            const btnAbrir =
                fragmento.querySelector(
                    ".btn-abrir-exercicio"
                );

            materia.textContent =
                obterMateriaNome(exercicio);

            titulo.textContent =
                textoSeguro(
                    exercicio.titulo,
                    "Exercício"
                );

            aula.textContent =
                obterAulaNome(exercicio);

            descricao.textContent =
                textoSeguro(
                    exercicio.descricao,
                    "Pratique o conteúdo desta aula."
                );

            const total =
                quantidadeQuestoes(exercicio);

            questoes.textContent =
                total === 1
                    ? "1 questão"
                    : `${total} questões`;

            const abrirExercicio = () => {
                if (!exercicio.id) {
                    return;
                }

                window.location.href =
                    `/exercicio.html?id=${encodeURIComponent(
                        exercicio.id
                    )}`;
            };

            btnAbrir.addEventListener(
    "click",
    (evento) => {

        evento.preventDefault();
        evento.stopPropagation();

        abrirExercicio();

    }
);

            /*
             * Permite abrir clicando no card,
             * mas não duplica o clique do botão.
             */

            card.addEventListener(
                "click",
                (evento) => {
                    if (
                        evento.target.closest(
                            ".btn-abrir-exercicio"
                        )
                    ) {
                        return;
                    }

                    abrirExercicio();
                }
            );

            listaExercicios.appendChild(
                fragmento
            );
        }
    );
}


/* =====================================
   EVENTOS DOS FILTROS
===================================== */

filtroMateria.addEventListener(
    "change",
    () => {
        /*
         * Ao trocar a matéria,
         * reconstruímos as aulas disponíveis.
         */

        filtroAula.value = "";

        montarFiltroAulas();

        aplicarFiltros();
    }
);


filtroAula.addEventListener(
    "change",
    () => {
        aplicarFiltros();
    }
);


btnLimparFiltros.addEventListener(
    "click",
    () => {
        filtroMateria.value = "";
        filtroAula.value = "";

        montarFiltroAulas();

        aplicarFiltros();
    }
);


/* =====================================
   TENTAR NOVAMENTE
===================================== */

btnTentarNovamente.addEventListener(
    "click",
    () => {
        carregarExercicios();
    }
);


/* =====================================
   SIDEBAR MOBILE
===================================== */

function abrirSidebar() {
    sidebar.classList.add("aberta");
    sidebarOverlay.classList.add("ativo");
}


function fecharSidebar() {
    sidebar.classList.remove("aberta");
    sidebarOverlay.classList.remove("ativo");
}


btnMenuMobile.addEventListener(
    "click",
    () => {
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


/* =====================================
   NAVEGAÇÃO
===================================== */

btnInicio.addEventListener(
    "click",
    () => {
        window.location.href =
            "/aluno.html";
    }
);


/*
 * Por enquanto essas áreas ainda ficam
 * na página principal do aluno.
 */

btnCursos.addEventListener(
    "click",
    () => {
        window.location.href =
            "/aluno.html";
    }
);


btnTrilhas.addEventListener(
    "click",
    () => {
        window.location.href =
            "/aluno.html";
    }
);


btnProgresso.addEventListener(
    "click",
    () => {
        window.location.href =
            "/aluno.html";
    }
);


btnPerfil.addEventListener(
    "click",
    () => {
        window.location.href =
            "/aluno.html";
    }
);


/* =====================================
   SAIR
===================================== */

btnSair.addEventListener(
    "click",
    () => {
        localStorage.removeItem(
            "usuarioGramaticalizando"
        );

        window.location.href = "/";
    }
);


/* =====================================
   INICIALIZAÇÃO
===================================== */

function iniciar() {
    const usuarioValido =
        carregarUsuario();

    if (!usuarioValido) {
        return;
    }

    carregarExercicios();
}


iniciar();