document.addEventListener("DOMContentLoaded", async () => {
    // Elementos de UI
    const userNameEl = document.getElementById("diag-user-name");
    const btnVoltar = document.querySelector(".btn-voltar");
    const modalDiagAuth = document.getElementById("modal-diag-auth");
    const fecharModalDiag = document.getElementById("fechar-modal-diag");
    const tabLogin = document.getElementById("tab-login");
    const tabRegistro = document.getElementById("tab-registro");
    const formDiagLogin = document.getElementById("form-diag-login");
    const formDiagRegistro = document.getElementById("form-diag-registro");
    const diagMsg = document.getElementById("diag-msg");
    const toastEl = document.getElementById("diag-toast");

    // Navegação de Etapas
    const stepNav1 = document.getElementById("step-nav-1");
    const stepNav2 = document.getElementById("step-nav-2");
    const stepNav3 = document.getElementById("step-nav-3");

    const etapaPerfil = document.getElementById("etapa-perfil");
    const etapaTeste = document.getElementById("etapa-teste");
    const etapaResultado = document.getElementById("etapa-resultado");

    const btnIniciarTeste = document.getElementById("btn-iniciar-teste");
    const btnEnviarDiagnostico = document.getElementById("btn-enviar-diagnostico");
    const btnIrDashboard = document.getElementById("btn-ir-dashboard");

    const questoesContainer = document.getElementById("questoes-container");
    const quizContador = document.getElementById("quiz-contador");

    let dadosPerfil = { foco: "concursos", horasSemanais: 8 };
    let questoesCarregadas = [];
    let respostasAluno = {}; // { [questaoId]: "a" | "b" | ... }
    let pendenteAvancarTeste = false;

    // Toast universal
    let toastTimeout = null;
    function mostrarToast(mensagem, tipo = "info") {
        if (!toastEl) return;
        clearTimeout(toastTimeout);
        toastEl.textContent = mensagem;
        toastEl.className = `diag-toast ativo ${tipo}`;
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove("ativo");
        }, 3800);
    }

    // Obter usuário da sessão
    function obterUsuario() {
        try {
            const raw = localStorage.getItem("usuarioGramaticalizando");
            if (raw) {
                const u = JSON.parse(raw);
                if (u && u.id) return u;
            }
        } catch (e) {}
        return null;
    }

    let usuario = obterUsuario();

    function atualizarEstadoAutenticacao() {
        usuario = obterUsuario();
        if (usuario && usuario.id) {
            if (userNameEl) {
                userNameEl.innerHTML = `<span style="display:inline-flex; align-items:center; gap:6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                    <strong>Aluno:</strong> ${usuario.nome || "Estudante"}
                </span>`;
            }
            if (btnVoltar) {
                btnVoltar.href = "/aluno.html";
                const txt = btnVoltar.querySelector("span");
                if (txt) txt.textContent = "Voltar ao Dashboard";
            }
        } else {
            if (userNameEl) {
                userNameEl.innerHTML = `<button type="button" id="btn-abrir-login-topo" class="btn-topo-entrar">Fazer Login / Cadastrar</button>`;
                const btnTopo = document.getElementById("btn-abrir-login-topo");
                if (btnTopo) {
                    btnTopo.addEventListener("click", () => abrirModalAuth("Faça login ou cadastre-se para salvar seu diagnóstico."));
                }
            }
            if (btnVoltar) {
                btnVoltar.href = "/";
                const txt = btnVoltar.querySelector("span");
                if (txt) txt.textContent = "Voltar ao Início";
            }
        }
    }

    atualizarEstadoAutenticacao();

    // Controle do Modal de Auth
    function abrirModalAuth(mensagemAviso = "") {
        if (!modalDiagAuth) return;
        if (diagMsg) {
            if (mensagemAviso) {
                diagMsg.textContent = mensagemAviso;
                diagMsg.className = "diag-auth-msg sucesso";
                diagMsg.style.display = "block";
            } else {
                diagMsg.style.display = "none";
            }
        }
        modalDiagAuth.classList.add("ativo");
    }

    function fecharModalAuth() {
        if (modalDiagAuth) {
            modalDiagAuth.classList.remove("ativo");
        }
    }

    if (fecharModalDiag) {
        fecharModalDiag.addEventListener("click", fecharModalAuth);
    }
    if (modalDiagAuth) {
        modalDiagAuth.addEventListener("click", (e) => {
            if (e.target === modalDiagAuth) fecharModalAuth();
        });
    }

    // Abas do Modal
    if (tabLogin && tabRegistro) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("ativo");
            tabRegistro.classList.remove("ativo");
            formDiagLogin.classList.remove("escondido");
            formDiagRegistro.classList.add("escondido");
            if (diagMsg) diagMsg.style.display = "none";
        });

        tabRegistro.addEventListener("click", () => {
            tabRegistro.classList.add("ativo");
            tabLogin.classList.remove("ativo");
            formDiagRegistro.classList.remove("escondido");
            formDiagLogin.classList.add("escondido");
            if (diagMsg) diagMsg.style.display = "none";
        });
    }

    // Submissão Login
    if (formDiagLogin) {
        formDiagLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("diag-login-email").value.trim();
            const senha = document.getElementById("diag-login-senha").value;
            const btnSubmit = document.getElementById("btn-submit-diag-login");

            btnSubmit.disabled = true;
            btnSubmit.textContent = "Entrando...";

            try {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.mensagem || "E-mail ou senha incorretos.");
                }

                localStorage.setItem("usuarioGramaticalizando", JSON.stringify(data.usuario));
                atualizarEstadoAutenticacao();
                fecharModalAuth();
                mostrarToast(`Bem-vindo, ${data.usuario.nome}!`, "sucesso");

                if (pendenteAvancarTeste) {
                    pendenteAvancarTeste = false;
                    await prosseguirParaTeste();
                }
            } catch (err) {
                if (diagMsg) {
                    diagMsg.textContent = err.message;
                    diagMsg.className = "diag-auth-msg erro";
                    diagMsg.style.display = "block";
                }
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<span>Entrar e Continuar Diagnóstico</span> <svg class="axion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
            }
        });
    }

    // Submissão Registro
    if (formDiagRegistro) {
        formDiagRegistro.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nome = document.getElementById("diag-reg-nome").value.trim();
            const email = document.getElementById("diag-reg-email").value.trim();
            const senha = document.getElementById("diag-reg-senha").value;
            const btnSubmit = document.getElementById("btn-submit-diag-registro");

            btnSubmit.disabled = true;
            btnSubmit.textContent = "Criando conta...";

            try {
                const res = await fetch("/api/registro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, email, senha })
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.mensagem || "Não foi possível criar sua conta.");
                }

                localStorage.setItem("usuarioGramaticalizando", JSON.stringify(data.usuario));
                atualizarEstadoAutenticacao();
                fecharModalAuth();
                mostrarToast(`Conta criada com sucesso! Olá, ${data.usuario.nome}!`, "sucesso");

                if (pendenteAvancarTeste) {
                    pendenteAvancarTeste = false;
                    await prosseguirParaTeste();
                }
            } catch (err) {
                if (diagMsg) {
                    diagMsg.textContent = err.message;
                    diagMsg.className = "diag-auth-msg erro";
                    diagMsg.style.display = "block";
                }
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<span>Criar Conta e Iniciar Teste</span> <svg class="axion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
            }
        });
    }

    // Avançar da Etapa 1 para Etapa 2
    btnIniciarTeste.addEventListener("click", async () => {
        const focoInput = document.querySelector('input[name="foco"]:checked');
        const horasInput = document.querySelector('input[name="horas"]:checked');

        dadosPerfil.foco = focoInput ? focoInput.value : "concursos";
        dadosPerfil.horasSemanais = horasInput ? Number(horasInput.value) : 8;

        // Se o aluno ainda não está autenticado, abre modal de login suave na tela
        usuario = obterUsuario();
        if (!usuario || !usuario.id) {
            pendenteAvancarTeste = true;
            abrirModalAuth("Para salvar seu progresso e gerar o cronograma personalizado, acesse ou crie sua conta:");
            return;
        }

        await prosseguirParaTeste();
    });

    async function prosseguirParaTeste() {
        etapaPerfil.classList.add("escondido");
        etapaTeste.classList.remove("escondido");

        stepNav1.classList.remove("active");
        stepNav1.classList.add("completed");
        stepNav2.classList.add("active");

        window.scrollTo({ top: 0, behavior: "smooth" });

        await carregarQuestoes();
    }

    async function carregarQuestoes() {
        try {
            questoesContainer.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">Carregando questões do teste com a metodologia Profª Wilma...</p>';
            const res = await fetch("/api/aluno/diagnostico/questoes");
            const data = await res.json();

            if (!res.ok || !data.sucesso) {
                throw new Error(data.erro || "Falha ao obter questões.");
            }

            questoesCarregadas = data.questoes || [];
            renderizarQuestoes();
        } catch (err) {
            questoesContainer.innerHTML = `<div style="color: #ef4444; text-align: center; padding: 2rem;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Falha ao carregar teste</p>
                <p style="font-size: 0.9rem; color: #64748b;">${err.message}</p>
                <button type="button" class="btn-primary" style="margin: 1rem auto 0; padding: 0.5rem 1rem;" onclick="location.reload()">Tentar Novamente</button>
            </div>`;
        }
    }

    function renderizarQuestoes() {
        if (!questoesCarregadas.length) {
            questoesContainer.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">Nenhuma questão disponível no momento.</p>';
            return;
        }

        quizContador.textContent = `${questoesCarregadas.length} Questões`;

        let html = "";
        questoesCarregadas.forEach((q, idx) => {
            html += `
                <div class="question-card" id="card-${q.id}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="question-num">Questão ${idx + 1} de ${questoesCarregadas.length}</span>
                        <span style="font-size: 0.75rem; background: #ede9fe; color: #6d28d9; padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 600;">${q.nomeTopico || q.topico}</span>
                    </div>
                    <p class="question-text">${q.enunciado}</p>
                    <div class="alternativas-list">
                        ${(q.alternativas || []).map(alt => `
                            <div class="alt-item" data-qid="${q.id}" data-alt="${alt.id}">
                                <span class="alt-letter">${alt.id.toUpperCase()})</span>
                                <span class="alt-text">${alt.texto}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        });

        questoesContainer.innerHTML = html;

        // Adicionar eventos de seleção
        questoesContainer.querySelectorAll(".alt-item").forEach(item => {
            item.addEventListener("click", () => {
                const qid = item.dataset.qid;
                const alt = item.dataset.alt;

                // Desmarcar irmãos
                const card = document.getElementById(`card-${qid}`);
                card.querySelectorAll(".alt-item").forEach(el => el.classList.remove("selected"));

                // Marcar selecionado
                item.classList.add("selected");
                respostasAluno[qid] = alt;
            });
        });
    }

    // Submeter Diagnóstico
    let confirmacaoPendente = false;
    btnEnviarDiagnostico.addEventListener("click", async () => {
        const totalRespondidas = Object.keys(respostasAluno).length;
        if (totalRespondidas < questoesCarregadas.length && !confirmacaoPendente) {
            const faltam = questoesCarregadas.length - totalRespondidas;
            mostrarToast(`Atenção: faltam ${faltam} questão(ões). Clique novamente para enviar mesmo assim.`, "erro");
            confirmacaoPendente = true;
            setTimeout(() => { confirmacaoPendente = false; }, 6000);
            return;
        }

        btnEnviarDiagnostico.disabled = true;
        btnEnviarDiagnostico.textContent = "Processando diagnóstico e calculando sua trilha...";

        const payload = {
            foco: dadosPerfil.foco,
            horasSemanais: dadosPerfil.horasSemanais,
            respostas: Object.keys(respostasAluno).map(qid => ({
                questaoId: qid,
                resposta: respostasAluno[qid]
            }))
        };

        try {
            const res = await fetch("/api/aluno/diagnostico/processar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok || !data.sucesso) {
                throw new Error(data.erro || "Falha ao processar diagnóstico.");
            }

            // Transição para Etapa 3
            etapaTeste.classList.add("escondido");
            etapaResultado.classList.remove("escondido");

            stepNav2.classList.remove("active");
            stepNav2.classList.add("completed");
            stepNav3.classList.add("active");
            stepNav3.classList.add("completed");

            window.scrollTo({ top: 0, behavior: "smooth" });

            renderizarResultados(data.diagnostico, data.cronogramaSemanal);
            mostrarToast("Diagnóstico processado com sucesso!", "sucesso");

        } catch (err) {
            mostrarToast(err.message, "erro");
            btnEnviarDiagnostico.disabled = false;
            btnEnviarDiagnostico.innerHTML = '<span>Concluir Diagnóstico e Gerar Trilha</span> <svg class="axion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        }
    });

    function renderizarResultados(diag, cronograma) {
        document.getElementById("res-score").textContent = `${diag.percentualGeral}%`;
        document.getElementById("res-level").textContent = `Nível ${diag.nivel}`;
        document.getElementById("res-sub").textContent = `Você acertou ${diag.totalAcertos} de ${diag.totalQuestoes} questões avaliadas.`;

        // Tópicos
        const topicsGrid = document.getElementById("res-topics-grid");
        let topicsHtml = "";
        const ranking = diag.rankingTopicos || [];
        ranking.forEach(t => {
            const cor = t.percentual >= 75 ? "#10b981" : (t.percentual >= 50 ? "#f59e0b" : "#ef4444");
            topicsHtml += `
                <div class="topic-stat-card">
                    <div class="topic-stat-header">
                        <span>${t.nome}</span>
                        <strong style="color: ${cor};">${t.percentual}% (${t.acertos}/${t.total})</strong>
                    </div>
                    <div class="topic-bar-bg">
                        <div class="topic-bar-fill" style="width: ${t.percentual}%; background: ${cor};"></div>
                    </div>
                </div>
            `;
        });
        topicsGrid.innerHTML = topicsHtml;

        // Cronograma Semanal
        const schedList = document.getElementById("res-schedule-list");
        let schedHtml = "";
        (cronograma || []).forEach(dia => {
            schedHtml += `
                <div class="schedule-day-card">
                    <div class="schedule-day-title">
                        <span>${dia.dia} — <strong>${dia.foco}</strong></span>
                        <span style="font-size: 0.8rem; background: #ede9fe; color: #6d28d9; padding: 0.2rem 0.5rem; border-radius: 6px;">~${dia.tempoEstimadoMin} min</span>
                    </div>
                    <div>
                        ${(dia.atividades || []).map(act => `
                            <div class="schedule-act-item">${act}</div>
                        `).join("")}
                    </div>
                </div>
            `;
        });
        schedList.innerHTML = schedHtml;
    }

    btnIrDashboard.addEventListener("click", () => {
        window.location.href = "/aluno.html";
    });
});
