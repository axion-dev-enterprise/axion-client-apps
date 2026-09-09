document.addEventListener("DOMContentLoaded", async () => {
    let usuario = null;
    try {
        const raw = localStorage.getItem("usuarioGramaticalizando");
        if (raw) usuario = JSON.parse(raw);
    } catch (e) {}

    if (!usuario || !usuario.id) {
        alert("Faça login para acessar o laboratório de redação.");
        window.location.href = "/";
        return;
    }

    const userInfoEl = document.getElementById("redacao-user-info");
    if (userInfoEl) {
        userInfoEl.textContent = `Aluno: ${usuario.nome || "Estudante"}`;
    }

    const temasContainer = document.getElementById("temas-container");
    const inputTema = document.getElementById("input-tema");
    const textoRedacao = document.getElementById("texto-redacao");
    const inputArquivoUrl = document.getElementById("input-arquivo-url");
    const contadorEl = document.getElementById("contador-caracteres");
    const btnEnviar = document.getElementById("btn-enviar-redacao");
    const historicoContainer = document.getElementById("historico-redacoes");

    // Contador de caracteres e palavras
    textoRedacao.addEventListener("input", () => {
        const txt = textoRedacao.value;
        const caracteres = txt.length;
        const palavras = txt.trim() ? txt.trim().split(/\s+/).length : 0;
        contadorEl.textContent = `${caracteres} caracteres | ~${palavras} palavras`;
    });

    // Carregar Temas
    async function carregarTemas() {
        try {
            const res = await fetch("/api/aluno/redacoes/temas");
            const data = await res.json();
            if (!res.ok || !data.sucesso) return;

            const temas = data.temas || [];
            if (!temas.length) {
                temasContainer.innerHTML = '<p style="color: #64748b;">Nenhum tema cadastrado no momento.</p>';
                return;
            }

            temasContainer.innerHTML = temas.map(t => `
                <div class="tema-card" data-titulo="${encodeURIComponent(t.titulo)}">
                    <div>
                        <span class="tema-tag">${t.foco}</span>
                        <h4 class="tema-titulo">${t.titulo}</h4>
                        <p class="tema-instrucao">${t.instrucoes}</p>
                    </div>
                    <span style="font-size: 0.8rem; color: #7c3aed; font-weight: 600; margin-top: 0.75rem;">Selecionar tema →</span>
                </div>
            `).join("");

            temasContainer.querySelectorAll(".tema-card").forEach(card => {
                card.addEventListener("click", () => {
                    temasContainer.querySelectorAll(".tema-card").forEach(c => c.classList.remove("selected"));
                    card.classList.add("selected");
                    inputTema.value = decodeURIComponent(card.dataset.titulo);
                    textoRedacao.focus();
                });
            });
        } catch (e) {
            console.error(e);
        }
    }

    // Carregar Histórico de Redações
    async function carregarHistorico() {
        try {
            historicoContainer.innerHTML = '<p style="color: #64748b; font-size: 0.9rem;">Carregando suas redações...</p>';
            const res = await fetch("/api/aluno/redacoes");
            const data = await res.json();

            if (!res.ok || !data.sucesso) {
                throw new Error(data.erro || "Falha ao carregar redações.");
            }

            const redacoes = data.redacoes || [];
            if (!redacoes.length) {
                historicoContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; border: 1px dashed #cbd5e1; border-radius: 8px;">
                        <p style="color: #64748b; font-size: 0.95rem;">Você ainda não enviou nenhuma redação para correção.</p>
                    </div>
                `;
                return;
            }

            historicoContainer.innerHTML = redacoes.map(r => {
                const dataEnvio = new Date(r.criadoEm).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                });
                const isCorrigida = r.status === "corrigida";
                const badgeClass = isCorrigida ? "status-corrigida" : "status-pendente";
                const statusTexto = isCorrigida ? "Corrigida pela Profª Wilma" : "Aguardando Correção";

                return `
                    <div class="envio-card">
                        <div class="envio-header">
                            <span class="envio-tema">${r.tema}</span>
                            <span class="status-badge ${badgeClass}">${statusTexto}</span>
                        </div>
                        <div class="envio-meta">
                            Enviada em: <strong>${dataEnvio}</strong>
                            ${r.arquivoUrl ? ` | <a href="${r.arquivoUrl}" target="_blank" style="color: #7c3aed;">Ver arquivo anexo ↗</a>` : ""}
                        </div>
                        ${r.texto ? `
                            <details style="font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem;">
                                <summary style="cursor: pointer; font-weight: 600; color: #64748b;">Visualizar texto enviado</summary>
                                <p style="white-space: pre-wrap; margin-top: 0.5rem; padding: 0.75rem; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">${r.texto}</p>
                            </details>
                        ` : ""}

                        ${isCorrigida ? `
                            <div class="feedback-box">
                                <div class="feedback-title">
                                    <span>Avaliação da Professora</span>
                                    <strong style="font-size: 1.1rem; color: #166534; background: #dcfce7; padding: 0.2rem 0.6rem; border-radius: 6px;">Nota: ${r.notaGeral} / 1000</strong>
                                </div>
                                <div class="feedback-text">${r.feedbackProfessora}</div>
                            </div>
                        ` : `
                            <p style="font-size: 0.85rem; color: #92400e; background: #fffbeb; padding: 0.5rem 0.75rem; border-radius: 6px; display: inline-block;">
                                A Profª Wilma está analisando sua redação e retornará com os apontamentos em breve.
                            </p>
                        `}
                    </div>
                `;
            }).join("");

        } catch (err) {
            historicoContainer.innerHTML = `<p style="color: #ef4444;">${err.message}</p>`;
        }
    }

    // Envio de Redação
    btnEnviar.addEventListener("click", async () => {
        const tema = inputTema.value.trim();
        const texto = textoRedacao.value.trim();
        const arquivoUrl = inputArquivoUrl.value.trim();

        if (tema.length < 3) {
            alert("Por favor, selecione ou informe o tema da sua redação.");
            inputTema.focus();
            return;
        }

        if (texto.length < 50 && !arquivoUrl) {
            alert("Digite o texto da sua redação (mínimo 50 caracteres) ou informe o link do arquivo.");
            textoRedacao.focus();
            return;
        }

        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando redação...";

        try {
            const res = await fetch("/api/aluno/redacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tema, texto, arquivoUrl })
            });

            const data = await res.json();
            if (!res.ok || !data.sucesso) {
                throw new Error(data.erro || "Erro ao enviar redação.");
            }

            alert("Redação enviada com sucesso para a Profª Wilma!");
            inputTema.value = "";
            textoRedacao.value = "";
            inputArquivoUrl.value = "";
            contadorEl.textContent = "0 caracteres | ~0 palavras";
            temasContainer.querySelectorAll(".tema-card").forEach(c => c.classList.remove("selected"));

            await carregarHistorico();

        } catch (err) {
            alert(err.message);
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar Redação para Correção →";
        }
    });

    await carregarTemas();
    await carregarHistorico();
});
