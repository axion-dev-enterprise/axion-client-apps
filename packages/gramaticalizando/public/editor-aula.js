import { confirmModal, promptModal } from '../src/frontend/components/Modal.js';

const params = new URLSearchParams(window.location.search);

let materiaAtualId = params.get("materia");
let aulaId = params.get("id");

let materiaAtual = null;
let aulaAtual = null;

let houveAlteracao = false;
let salvando = false;


const nomeMateria = document.getElementById("nome-materia");

const tituloAula = document.getElementById("titulo-aula");
const videoUrlInput = document.getElementById("video-url");
const pdfUrlInput = document.getElementById("pdf-url");
const editor = document.getElementById("conteudo-aula");

const statusAula = document.getElementById("status-aula");
const estadoSalvamento = document.getElementById("estado-salvamento");

const btnVoltar = document.getElementById("btn-voltar");

const btnSalvarRascunho = document.getElementById(
    "btn-salvar-rascunho"
);

const btnPublicar = document.getElementById(
    "btn-publicar"
);

const formatoTexto = document.getElementById(
    "formato-texto"
);

const btnLink = document.getElementById("btn-link");
const btnCitacao = document.getElementById("btn-citacao");

const toast = document.getElementById("toast");


function mostrarToast(mensagem, tipo = "sucesso") {

    toast.textContent = mensagem;

    toast.className = `toast ${tipo} mostrar`;

    clearTimeout(mostrarToast.timer);

    mostrarToast.timer = setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 3000);
}


function marcarAlteracao() {

    houveAlteracao = true;

    estadoSalvamento.textContent = "Alterações não salvas";
}


function marcarSalvo() {

    houveAlteracao = false;

    estadoSalvamento.textContent = "Todas as alterações foram salvas";
}


function atualizarStatus(publicado) {

    if (publicado) {

        statusAula.textContent = "Publicado";

        statusAula.classList.remove("rascunho");
        statusAula.classList.add("publicado");

    } else {

        statusAula.textContent = "Rascunho";

        statusAula.classList.remove("publicado");
        statusAula.classList.add("rascunho");
    }
}


async function verificarSessao() {

    try {

        const resposta = await fetch("/api/admin/me");

        if (!resposta.ok) {

            window.location.href = "/admin-login.html";
            return false;
        }

        return true;

    } catch (erro) {

        console.error("Erro ao verificar sessão:", erro);

        mostrarToast(
            "Não foi possível verificar sua sessão.",
            "erro"
        );

        return false;
    }
}


async function carregarMateria(id) {

    if (!id) {
        return;
    }

    try {

        const resposta = await fetch("/api/admin/materias");

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar as matérias."
            );
        }

        const materias = await resposta.json();

        materiaAtual = materias.find(
            materia => String(materia.id) === String(id)
        );

        if (!materiaAtual) {

            nomeMateria.textContent = "Matéria não encontrada";
            return;
        }

        materiaAtualId = materiaAtual.id;

        nomeMateria.textContent = materiaAtual.nome;

    } catch (erro) {

        console.error(erro);

        nomeMateria.textContent = "Erro ao carregar matéria";

        mostrarToast(
            "Erro ao carregar a matéria.",
            "erro"
        );
    }
}


async function carregarAula() {

    if (!aulaId) {
        return;
    }

    try {

        estadoSalvamento.textContent = "Carregando aula...";

        const resposta = await fetch(
            `/api/admin/aulas/${encodeURIComponent(aulaId)}`
        );

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar a aula."
            );
        }

        aulaAtual = await resposta.json();

        tituloAula.value = aulaAtual.titulo || "";
        if (videoUrlInput) videoUrlInput.value = aulaAtual.videoUrl || "";
        if (pdfUrlInput) pdfUrlInput.value = aulaAtual.materialPdfUrl || "";

        editor.innerHTML = aulaAtual.conteudo || "";

        materiaAtualId = aulaAtual.materiaId;

        atualizarStatus(
            Boolean(aulaAtual.publicado)
        );

        await carregarMateria(materiaAtualId);

        marcarSalvo();

    } catch (erro) {

        console.error(erro);

        mostrarToast(
            "Erro ao carregar a aula.",
            "erro"
        );
    }
}


function executarComando(comando, valor = null) {

    editor.focus();

    try {

        document.execCommand(
            comando,
            false,
            valor
        );

        marcarAlteracao();

    } catch (erro) {

        console.error(
            `Erro ao executar comando ${comando}:`,
            erro
        );
    }
}


document
    .querySelectorAll("[data-command]")
    .forEach(botao => {

        botao.addEventListener(
            "mousedown",
            evento => {

                evento.preventDefault();

                const comando =
                    botao.dataset.command;

                executarComando(comando);
            }
        );
    });


formatoTexto.addEventListener(
    "change",
    () => {

        const formato =
            formatoTexto.value;

        executarComando(
            "formatBlock",
            `<${formato}>`
        );

        editor.focus();
    }
);


btnLink.addEventListener(
    "mousedown",
    async evento => {

        evento.preventDefault();

        editor.focus();

        const url = await promptModal(
            "Digite o endereço completo do link (ex: https://...):",
            "https://",
            "Inserir Link na Aula"
        );

        if (!url) {
            return;
        }

        let linkFinal = url.trim();

        if (
            !linkFinal.startsWith("http://") &&
            !linkFinal.startsWith("https://")
        ) {

            linkFinal =
                `https://${linkFinal}`;
        }

        executarComando(
            "createLink",
            linkFinal
        );
    }
);


btnCitacao.addEventListener(
    "mousedown",
    evento => {

        evento.preventDefault();

        executarComando(
            "formatBlock",
            "<blockquote>"
        );
    }
);


tituloAula.addEventListener(
    "input",
    marcarAlteracao
);

if (videoUrlInput) {
    videoUrlInput.addEventListener("input", marcarAlteracao);
}

if (pdfUrlInput) {
    pdfUrlInput.addEventListener("input", marcarAlteracao);
}

editor.addEventListener(
    "input",
    marcarAlteracao
);


function validarAula() {

    const titulo =
        tituloAula.value.trim();

    const texto =
        editor.innerText.trim();

    if (titulo.length < 3) {

        mostrarToast(
            "Digite um título com pelo menos 3 caracteres.",
            "erro"
        );

        tituloAula.focus();

        return false;
    }

    if (texto.length < 10) {

        mostrarToast(
            "Escreva um pouco mais de conteúdo antes de salvar.",
            "erro"
        );

        editor.focus();

        return false;
    }

    return true;
}


async function salvarAula(publicado) {

    if (salvando) {
        return;
    }

    if (!validarAula()) {
        return;
    }

    if (!materiaAtualId) {

        mostrarToast(
            "Não foi possível identificar a matéria desta aula.",
            "erro"
        );

        return;
    }

    salvando = true;

    btnSalvarRascunho.disabled = true;
    btnPublicar.disabled = true;

    estadoSalvamento.textContent = "Salvando...";

    const dados = {
        titulo: tituloAula.value.trim(),
        videoUrl: videoUrlInput ? videoUrlInput.value.trim() : null,
        materialPdfUrl: pdfUrlInput ? pdfUrlInput.value.trim() : null,
        conteudo: editor.innerHTML.trim(),
        publicado
    };

    try {

        let resposta;

        if (aulaId) {

            resposta = await fetch(
                `/api/admin/aulas/${encodeURIComponent(aulaId)}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );

        } else {

            resposta = await fetch(
                `/api/admin/materias/${encodeURIComponent(
                    materiaAtualId
                )}/aulas`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );
        }

        const resultado =
            await resposta.json()
                .catch(() => ({}));

        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                resultado.mensagem ||
                "Erro ao salvar aula."
            );
        }

        aulaAtual =
            resultado.aula || resultado;

        if (!aulaId && aulaAtual?.id) {

            aulaId = aulaAtual.id;

            const novaUrl =
                `/editor-aula.html?id=${encodeURIComponent(
                    aulaId
                )}`;

            window.history.replaceState(
                {},
                "",
                novaUrl
            );
        }

        atualizarStatus(publicado);

        marcarSalvo();

        mostrarToast(
            publicado
                ? "Aula publicada com sucesso!"
                : "Rascunho salvo com sucesso!",
            "sucesso"
        );

    } catch (erro) {

        console.error(erro);

        estadoSalvamento.textContent =
            "Erro ao salvar";

        mostrarToast(
            erro.message || "Erro ao salvar aula.",
            "erro"
        );

    } finally {

        salvando = false;

        btnSalvarRascunho.disabled = false;
        btnPublicar.disabled = false;
    }
}


btnSalvarRascunho.addEventListener(
    "click",
    () => salvarAula(false)
);


btnPublicar.addEventListener(
    "click",
    () => salvarAula(true)
);


btnVoltar.addEventListener(
    "click",
    async () => {

        if (houveAlteracao) {

            const desejaSair = await confirmModal(
                "Existem alterações que ainda não foram salvas. Deseja sair mesmo assim?",
                "Alterações não salvas"
            );

            if (!desejaSair) {
                return;
            }
        }

        if (materiaAtualId) {

            window.location.href =
                `/admin.html?materia=${encodeURIComponent(
                    materiaAtualId
                )}`;

        } else {

            window.location.href =
                "/admin.html";
        }
    }
);


window.addEventListener(
    "beforeunload",
    evento => {

        if (!houveAlteracao) {
            return;
        }

        evento.preventDefault();

        evento.returnValue = "";
    }
);


async function iniciarEditor() {

    const sessaoValida =
        await verificarSessao();

    if (!sessaoValida) {
        return;
    }

    if (aulaId) {

        await carregarAula();

        return;
    }

    if (materiaAtualId) {

        await carregarMateria(
            materiaAtualId
        );

        atualizarStatus(false);

        marcarSalvo();

        tituloAula.focus();

        return;
    }

    nomeMateria.textContent =
        "Matéria não identificada";

    mostrarToast(
        "Essa página foi aberta sem uma matéria.",
        "erro"
    );
}


iniciarEditor();