const fs = require("fs/promises");
const crypto = require("crypto");

const writeLocks = new Map();

async function runWithLock(filePath, asyncOp) {
    const currentPromise = writeLocks.get(filePath) || Promise.resolve();
    const nextPromise = currentPromise
        .then(() => asyncOp())
        .catch(err => {
            console.error(`Erro em operação de escrita para ${filePath}:`, err);
            throw err;
        })
        .finally(() => {
            if (writeLocks.get(filePath) === nextPromise) {
                writeLocks.delete(filePath);
            }
        });

    writeLocks.set(filePath, nextPromise);
    return nextPromise;
}

async function lerArquivoJson(caminho) {
    try {
        const conteudo = await fs.readFile(caminho, "utf8");
        const conteudoLimpo = conteudo.replace(/^\uFEFF/, "").trim();
        if (!conteudoLimpo) {
            return [];
        }
        const dados = JSON.parse(conteudoLimpo);
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        if (erro.code === "ENOENT") {
            await fs.writeFile(caminho, "[]", "utf8");
            return [];
        }
        throw erro;
    }
}

async function salvarArquivoJson(caminho, dados) {
    return runWithLock(caminho, async () => {
        await fs.writeFile(caminho, JSON.stringify(dados, null, 2), "utf8");
    });
}

function criarDadosEstudoPadrao() {
    return {
        aulasConcluidas: [],
        exercicios: [],
        cursosIniciados: [],
        trilhasAtivas: [],
        atividades: [],
        sequencia: 0,
        ultimoAcesso: null,
        diagnostico: null,
        cronogramaSemanal: null
    };
}

function garantirDadosEstudo(usuario) {
    if (!usuario.estudos || typeof usuario.estudos !== "object") {
        usuario.estudos = criarDadosEstudoPadrao();
    }
    const padrao = criarDadosEstudoPadrao();
    Object.keys(padrao).forEach(chave => {
        if (usuario.estudos[chave] === undefined) {
            usuario.estudos[chave] = padrao[chave];
        }
    });
    if (!usuario.plano) {
        usuario.plano = "gratuito"; // gratuito, basico, intermediario, master
    }
    return usuario.estudos;
}

function normalizarResposta(valor) {
    return String(valor ?? "")
        .trim()
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function limparQuestaoParaAluno(questao) {
    const base = {
        id: questao.id,
        tipo: questao.tipo,
        enunciado: questao.enunciado,
        banca: questao.banca || null,
        ano: questao.ano || null,
        orgao: questao.orgao || null,
        cargo: questao.cargo || null
    };

    if (questao.tipo === "multipla-escolha") {
        base.alternativas = Array.isArray(questao.alternativas)
            ? questao.alternativas.map(alternativa => ({
                  id: alternativa.id,
                  texto: alternativa.texto
              }))
            : [];
    }
    return base;
}

function validarQuestoes(questoesRecebidas) {
    if (!Array.isArray(questoesRecebidas) || questoesRecebidas.length === 0) {
        return { valido: false, mensagem: "Adicione pelo menos uma questão." };
    }
    if (questoesRecebidas.length > 100) {
        return { valido: false, mensagem: "Um exercício pode ter no máximo 100 questões." };
    }

    const questoes = [];
    for (let indice = 0; indice < questoesRecebidas.length; indice += 1) {
        const recebida = questoesRecebidas[indice] || {};
        const tipo = String(recebida.tipo || "").trim();
        const enunciado = String(recebida.enunciado || "").trim();

        if (!["multipla-escolha", "resposta-escrita"].includes(tipo)) {
            return { valido: false, mensagem: `A questão ${indice + 1} possui um tipo inválido.` };
        }
        if (enunciado.length < 2 || enunciado.length > 5000) {
            return { valido: false, mensagem: `Digite um enunciado válido para a questão ${indice + 1}.` };
        }

        const questao = {
            id: String(recebida.id || crypto.randomUUID()),
            tipo,
            enunciado,
            banca: String(recebida.banca || "").trim() || null,
            ano: String(recebida.ano || "").trim() || null,
            orgao: String(recebida.orgao || "").trim() || null,
            cargo: String(recebida.cargo || "").trim() || null,
            comentarioProfessora: String(recebida.comentarioProfessora || "").trim() || null
        };

        if (tipo === "multipla-escolha") {
            if (!Array.isArray(recebida.alternativas) || recebida.alternativas.length < 2) {
                return { valido: false, mensagem: `A questão ${indice + 1} precisa ter pelo menos 2 alternativas.` };
            }
            if (recebida.alternativas.length > 10) {
                return { valido: false, mensagem: `A questão ${indice + 1} pode ter no máximo 10 alternativas.` };
            }

            const alternativas = recebida.alternativas.map((alternativa, altIndice) => ({
                id: String(alternativa?.id || crypto.randomUUID()),
                texto: String(alternativa?.texto || "").trim(),
                ordem: altIndice
            }));

            if (alternativas.some(alt => !alt.texto)) {
                return { valido: false, mensagem: `Preencha todas as alternativas da questão ${indice + 1}.` };
            }

            const respostaCorreta = String(recebida.respostaCorreta || "").trim();
            const existeRespostaCorreta = alternativas.some(alt => alt.id === respostaCorreta);

            if (!existeRespostaCorreta) {
                return { valido: false, mensagem: `Defina a alternativa correta da questão ${indice + 1}.` };
            }

            questao.alternativas = alternativas.map(({ id, texto }) => ({ id, texto }));
            questao.respostaCorreta = respostaCorreta;
        } else {
            const respostasAceitas = Array.isArray(recebida.respostasAceitas)
                ? recebida.respostasAceitas.map(r => String(r || "").trim()).filter(Boolean)
                : [];

            if (respostasAceitas.length === 0) {
                return { valido: false, mensagem: `Defina pelo menos uma resposta aceita para a questão ${indice + 1}.` };
            }
            questao.respostasAceitas = respostasAceitas;
        }

        questoes.push(questao);
    }

    return { valido: true, questoes };
}

function corrigirQuestao(questao, respostaAluno) {
    if (questao.tipo === "multipla-escolha") {
        const resposta = String(respostaAluno || "").trim();
        const correta = resposta === String(questao.respostaCorreta || "");
        const alternativaCorreta = Array.isArray(questao.alternativas)
            ? questao.alternativas.find(alt => alt.id === questao.respostaCorreta)
            : null;
        const alternativaAluno = Array.isArray(questao.alternativas)
            ? questao.alternativas.find(alt => alt.id === resposta)
            : null;

        return {
            correta,
            respostaAluno: alternativaAluno ? alternativaAluno.texto : resposta,
            respostaCorreta: alternativaCorreta ? alternativaCorreta.texto : "",
            comentarioProfessora: questao.comentarioProfessora || null
        };
    }

    const normalizada = normalizarResposta(respostaAluno);
    const aceitas = Array.isArray(questao.respostasAceitas) ? questao.respostasAceitas : [];
    const correta = aceitas.some(r => normalizarResposta(r) === normalizada);

    return {
        correta,
        respostaAluno: String(respostaAluno ?? "").trim(),
        respostaCorreta: aceitas[0] || "",
        comentarioProfessora: questao.comentarioProfessora || null
    };
}

module.exports = {
    lerArquivoJson,
    salvarArquivoJson,
    criarDadosEstudoPadrao,
    garantirDadosEstudo,
    normalizarResposta,
    limparQuestaoParaAluno,
    validarQuestoes,
    corrigirQuestao
};
