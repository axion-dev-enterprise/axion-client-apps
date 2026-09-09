document.addEventListener("DOMContentLoaded", async () => {
    // 1. Verificar autenticação do aluno
    let usuario = null;
    try {
        const raw = localStorage.getItem("usuarioGramaticalizando");
        if (raw) {
            usuario = JSON.parse(raw);
        }
    } catch (e) {}

    if (!usuario || !usuario.id) {
        alert("Por favor, faça login ou cadastre-se para realizar o teste de diagnóstico.");
        window.location.href = "/";
        return;
    }

    const userNameEl = document.getElementById("diag-user-name");
    if (userNameEl) {
        userNameEl.textContent = `Aluno: ${usuario.nome || "Estudante"}`;
    }

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

    // Avançar da Etapa 1 para Etapa 2
    btnIniciarTeste.addEventListener("click", async () => {
        const focoInput = document.querySelector('input[name="foco"]:checked');
        const horasInput = document.querySelector('input[name="horas"]:checked');

        dadosPerfil.foco = focoInput ? focoInput.value : "concursos";
        dadosPerfil.horasSemanais = horasInput ? Number(horasInput.value) : 8;

        etapaPerfil.classList.add("escondido");
        etapaTeste.classList.remove("escondido");

        stepNav1.classList.remove("active");
        stepNav1.classList.add("completed");
        stepNav2.classList.add("active");

        window.scrollTo({ top: 0, behavior: "smooth" });

        await carregarQuestoes();
    });

    async function carregarQuestoes() {
        try {
            questoesContainer.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">Carregando questões do teste...</p>';
            const res = await fetch("/api/aluno/diagnostico/questoes");
            const data = await res.json();

            if (!res.ok || !data.sucesso) {
                throw new Error(data.erro || "Falha ao obter questões.");
            }

            questoesCarregadas = data.questoes || [];
            renderizarQuestoes();
        } catch (err) {
            questoesContainer.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 2rem;">${err.message}</p>`;
        }
    }

    function renderizarQuestoes() {
        if (!questoesCarregadas.length) {
            questoesContainer.innerHTML = '<p style="text-align: center; color: #64748b;">Nenhuma questão encontrada.</p>';
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
    btnEnviarDiagnostico.addEventListener("click", async () => {
        const totalRespondidas = Object.keys(respostasAluno).length;
        if (totalRespondidas < questoesCarregadas.length) {
            const faltam = questoesCarregadas.length - totalRespondidas;
            if (!confirm(`Você ainda não respondeu ${faltam} questão(ões). Deseja enviar o teste assim mesmo?`)) {
                return;
            }
        }

        btnEnviarDiagnostico.disabled = true;
        btnEnviarDiagnostico.textContent = "Processando diagnóstico com a IA da Profª Wilma...";

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

        } catch (err) {
            alert(err.message);
            btnEnviarDiagnostico.disabled = false;
            btnEnviarDiagnostico.innerHTML = '<span>Concluir Diagnóstico e Gerar Trilha</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
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
