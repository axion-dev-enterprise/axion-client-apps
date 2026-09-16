const fs = require("fs/promises");
const crypto = require("crypto");
const paths = require("../config/paths");
const db = require("../db");

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

// -----------------------------------------------------------------------------
// POSTGRESQL READ ADAPTERS
// -----------------------------------------------------------------------------
async function lerDoPostgres(caminho) {
    if (!db.pool) return null;

    try {
        if (caminho === paths.USUARIOS) {
            const res = await db.query(`
                SELECT u.id, u.nome, u.email, u.senha, u.tipo, u.plano, 
                       u.status_plano as "statusPlano", u.codigo_referencia as "codigoReferencia",
                       u.data_solicitacao_plano as "dataSolicitacaoPlano",
                       u.data_aprovacao_plano as "dataAprovacaoPlano",
                       u.criado_em as "criadoEm",
                       row_to_json(e.*) as estudos
                FROM usuarios u
                LEFT JOIN estudos_aluno e ON u.id = e.usuario_id
                ORDER BY u.criado_em ASC
            `);
            return res.rows.map(row => {
                const estudos = row.estudos || {};
                return {
                    id: row.id,
                    nome: row.nome,
                    email: row.email,
                    senha: row.senha,
                    tipo: row.tipo,
                    perfil: row.tipo === 'admin' ? 'professor' : 'aluno',
                    plano: row.plano,
                    statusPlano: row.statusPlano,
                    codigoReferencia: row.codigoReferencia,
                    dataSolicitacaoPlano: row.dataSolicitacaoPlano,
                    dataAprovacaoPlano: row.dataAprovacaoPlano,
                    criadoEm: row.criadoEm,
                    estudos: {
                        aulasConcluidas: estudos.aulas_concluidas || [],
                        exercicios: estudos.exercicios || [],
                        cursosIniciados: estudos.cursos_iniciados || [],
                        trilhasAtivas: estudos.trilhas_ativas || [],
                        atividades: estudos.atividades || [],
                        sequencia: estudos.sequencia || 0,
                        ultimoAcesso: estudos.ultimo_acesso || null,
                        diagnostico: estudos.diagnostico || null,
                        cronogramaSemanal: estudos.cronograma_semanal || null
                    }
                };
            });
        }

        if (caminho === paths.VESTIBULAR) {
            const vRes = await db.query("SELECT * FROM vestibular_videoaulas ORDER BY criado_em DESC");
            const tRes = await db.query("SELECT * FROM vestibular_temas ORDER BY criado_em DESC");
            const rRes = await db.query("SELECT * FROM vestibular_redacoes ORDER BY enviado_em DESC");

            return {
                videoaulas: vRes.rows.map(r => ({
                    id: r.id,
                    titulo: r.titulo,
                    vestibular: r.vestibular,
                    duracao: r.duracao,
                    url: r.url,
                    descricao: r.descricao,
                    professor: r.professor,
                    criadoEm: r.criado_em
                })),
                temas: tRes.rows.map(r => ({
                    id: r.id,
                    titulo: r.titulo,
                    vestibular: r.vestibular,
                    ano: r.ano,
                    instrucoes: r.instrucoes,
                    textosMotivadores: r.textos_motivadores,
                    dataLimite: r.data_limite
                })),
                redacoes: rRes.rows.map(r => ({
                    id: r.id,
                    alunoId: r.aluno_id,
                    alunoNome: r.aluno_nome,
                    alunoEmail: r.aluno_email,
                    temaId: r.tema_id,
                    temaTitulo: r.tema_titulo,
                    vestibular: r.vestibular,
                    arquivoNome: r.arquivo_nome,
                    arquivoUrl: r.arquivo_url,
                    texto: r.texto,
                    status: r.status,
                    notaFinal: r.nota_final,
                    criterios: typeof r.criterios === 'string' ? JSON.parse(r.criterios) : r.criterios,
                    feedbackProfessora: r.feedback_professora,
                    enviadoEm: r.enviado_em,
                    corrigidoEm: r.corrigido_em
                }))
            };
        }

        if (caminho === paths.MATERIAS) {
            const res = await db.query("SELECT * FROM materias ORDER BY ordem ASC");
            return res.rows.map(r => ({
                id: r.id,
                nome: r.nome,
                descricao: r.descricao,
                ordem: r.ordem,
                icone: r.icone,
                totalAulas: r.total_aulas,
                criadoEm: r.criado_em,
                atualizadoEm: r.atualizado_em
            }));
        }

        if (caminho === paths.AULAS) {
            const res = await db.query("SELECT * FROM aulas ORDER BY ordem ASC");
            return res.rows.map(r => ({
                id: r.id,
                materiaId: r.materia_id,
                titulo: r.titulo,
                subtitulo: r.subtitulo,
                conteudo: r.conteudo,
                duracao: r.duracao,
                ordem: r.ordem,
                videoUrl: r.video_url,
                materialPdfUrl: r.material_pdf_url,
                publicado: r.publicado,
                criadoEm: r.criado_em,
                atualizadoEm: r.atualizado_em
            }));
        }

        if (caminho === paths.EXERCICIOS) {
            const res = await db.query("SELECT * FROM exercicios ORDER BY criado_em DESC");
            return res.rows.map(r => ({
                id: r.id,
                materiaId: r.materia_id,
                aulaId: r.aula_id,
                titulo: r.titulo,
                descricao: r.descricao,
                publicado: r.publicado,
                totalQuestoes: r.total_questoes,
                questoes: typeof r.questoes === 'string' ? JSON.parse(r.questoes) : (r.questoes || []),
                criadoEm: r.criado_em,
                atualizadoEm: r.atualizado_em
            }));
        }

        if (caminho === paths.SIMULADOS) {
            const res = await db.query("SELECT * FROM simulados ORDER BY criado_em DESC");
            return res.rows.map(r => ({
                id: r.id,
                titulo: r.titulo,
                descricao: r.descricao,
                banca: r.banca,
                tempoMinutos: r.tempo_minutos,
                publicado: r.publicado,
                totalQuestoes: r.total_questoes,
                questoes: typeof r.questoes === 'string' ? JSON.parse(r.questoes) : (r.questoes || []),
                criadoEm: r.criado_em,
                atualizadoEm: r.atualizado_em
            }));
        }

        if (caminho === paths.REDACOES) {
            const res = await db.query("SELECT * FROM redacoes ORDER BY criado_em DESC");
            return res.rows.map(r => ({
                id: r.id,
                usuarioId: r.usuario_id,
                alunoNome: r.aluno_nome,
                alunoEmail: r.aluno_email,
                tema: r.tema,
                texto: r.texto,
                arquivoUrl: r.arquivo_url,
                status: r.status,
                notaGeral: r.nota_geral,
                competencias: typeof r.competencias === 'string' ? JSON.parse(r.competencias) : r.competencias,
                feedbackProfessora: r.feedback_professora,
                criadoEm: r.criado_em,
                atualizadoEm: r.atualizado_em,
                corrigidoEm: r.corrigido_em
            }));
        }

        if (caminho === paths.TEMAS_REDACAO) {
            const res = await db.query("SELECT * FROM temas_redacao ORDER BY criado_em DESC");
            return res.rows.map(r => ({
                id: r.id,
                titulo: r.titulo,
                foco: r.foco,
                instrucoes: r.instrucoes,
                categoria: r.categoria,
                textosMotivadores: typeof r.textos_motivadores === 'string' ? JSON.parse(r.textos_motivadores) : (r.textos_motivadores || []),
                prazo: r.prazo,
                criadoEm: r.criado_em
            }));
        }

        if (caminho === paths.MATERIAIS_APOIO) {
            const res = await db.query("SELECT * FROM materiais_apoio ORDER BY criado_em DESC");
            return res.rows.map(r => ({
                id: r.id,
                titulo: r.titulo,
                descricao: r.descricao,
                moduloId: r.modulo_id,
                categoria: r.categoria,
                tipo: r.tipo,
                tamanho: r.tamanho,
                paginas: r.paginas,
                arquivoUrl: r.arquivo_url || r.download_url,
                downloadUrl: r.download_url || r.arquivo_url,
                criadoEm: r.criado_em
            }));
        }
    } catch (err) {
        console.warn("Aviso ao ler dados do PostgreSQL, acionando fallback local:", err.message);
        return null;
    }

    return null;
}

// -----------------------------------------------------------------------------
// POSTGRESQL WRITE ADAPTERS
// -----------------------------------------------------------------------------
async function salvarNoPostgres(caminho, dados) {
    if (!db.pool) return false;

    try {
        if (caminho === paths.USUARIOS && Array.isArray(dados)) {
            for (const u of dados) {
                await db.query(`
                    INSERT INTO usuarios (id, nome, email, senha, tipo, plano, status_plano, codigo_referencia, data_solicitacao_plano, data_aprovacao_plano, criado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    ON CONFLICT (id) DO UPDATE SET 
                        nome = EXCLUDED.nome,
                        email = EXCLUDED.email,
                        tipo = EXCLUDED.tipo,
                        plano = EXCLUDED.plano,
                        status_plano = EXCLUDED.status_plano,
                        codigo_referencia = EXCLUDED.codigo_referencia,
                        data_solicitacao_plano = EXCLUDED.data_solicitacao_plano,
                        data_aprovacao_plano = EXCLUDED.data_aprovacao_plano
                `, [
                    u.id, u.nome, u.email, u.senha, u.tipo || 'aluno', u.plano || 'medio', 
                    u.statusPlano || 'ativo', u.codigoReferencia || null,
                    u.dataSolicitacaoPlano || null, u.dataAprovacaoPlano || null,
                    u.criadoEm || new Date().toISOString()
                ]);

                if (u.estudos) {
                    await db.query(`
                        INSERT INTO estudos_aluno (usuario_id, aulas_concluidas, exercicios, cursos_iniciados, trilhas_ativas, atividades, sequencia, ultimo_acesso, diagnostico, cronograma_semanal)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                        ON CONFLICT (usuario_id) DO UPDATE SET
                            aulas_concluidas = EXCLUDED.aulas_concluidas,
                            exercicios = EXCLUDED.exercicios,
                            cursos_iniciados = EXCLUDED.cursos_iniciados,
                            trilhas_ativas = EXCLUDED.trilhas_ativas,
                            atividades = EXCLUDED.atividades,
                            sequencia = EXCLUDED.sequencia,
                            ultimo_acesso = EXCLUDED.ultimo_acesso,
                            diagnostico = EXCLUDED.diagnostico,
                            cronograma_semanal = EXCLUDED.cronograma_semanal
                    `, [
                        u.id,
                        JSON.stringify(u.estudos.aulasConcluidas || []),
                        JSON.stringify(u.estudos.exercicios || []),
                        JSON.stringify(u.estudos.cursosIniciados || []),
                        JSON.stringify(u.estudos.trilhasAtivas || []),
                        JSON.stringify(u.estudos.atividades || []),
                        u.estudos.sequencia || 0,
                        u.estudos.ultimoAcesso || null,
                        JSON.stringify(u.estudos.diagnostico || null),
                        JSON.stringify(u.estudos.cronogramaSemanal || null)
                    ]);
                }
            }
            return true;
        }

        if (caminho === paths.VESTIBULAR && dados && typeof dados === 'object') {
            if (Array.isArray(dados.videoaulas)) {
                const idsAtivos = dados.videoaulas.map(v => v.id);
                if (idsAtivos.length > 0) {
                    await db.query("DELETE FROM vestibular_videoaulas WHERE id != ALL($1)", [idsAtivos]);
                } else {
                    await db.query("DELETE FROM vestibular_videoaulas");
                }

                for (const v of dados.videoaulas) {
                    await db.query(`
                        INSERT INTO vestibular_videoaulas (id, titulo, vestibular, duracao, url, descricao, professor, criado_em)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        ON CONFLICT (id) DO UPDATE SET
                            titulo = EXCLUDED.titulo,
                            vestibular = EXCLUDED.vestibular,
                            duracao = EXCLUDED.duracao,
                            url = EXCLUDED.url,
                            descricao = EXCLUDED.descricao,
                            professor = EXCLUDED.professor
                    `, [v.id, v.titulo, v.vestibular, v.duracao, v.url, v.descricao, v.professor || 'Profª Wilma', v.criadoEm || new Date().toISOString()]);
                }
            }

            if (Array.isArray(dados.temas)) {
                const idsAtivos = dados.temas.map(t => t.id);
                if (idsAtivos.length > 0) {
                    await db.query("DELETE FROM vestibular_temas WHERE id != ALL($1)", [idsAtivos]);
                } else {
                    await db.query("DELETE FROM vestibular_temas");
                }

                for (const t of dados.temas) {
                    await db.query(`
                        INSERT INTO vestibular_temas (id, titulo, vestibular, ano, instrucoes, textos_motivadores, data_limite)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        ON CONFLICT (id) DO UPDATE SET
                            titulo = EXCLUDED.titulo,
                            vestibular = EXCLUDED.vestibular,
                            ano = EXCLUDED.ano,
                            instrucoes = EXCLUDED.instrucoes,
                            textos_motivadores = EXCLUDED.textos_motivadores,
                            data_limite = EXCLUDED.data_limite
                    `, [t.id, t.titulo, t.vestibular, t.ano || '2026', t.instrucoes, t.textosMotivadores, t.dataLimite]);
                }
            }

            if (Array.isArray(dados.redacoes)) {
                for (const r of dados.redacoes) {
                    const criteriosJson = typeof r.criterios === 'string' ? r.criterios : JSON.stringify(r.criterios || null);
                    await db.query(`
                        INSERT INTO vestibular_redacoes (id, aluno_id, aluno_nome, aluno_email, tema_id, tema_titulo, vestibular, arquivo_nome, arquivo_url, texto, status, nota_final, criterios, feedback_professora, enviado_em, corrigido_em)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                        ON CONFLICT (id) DO UPDATE SET
                            status = EXCLUDED.status,
                            nota_final = EXCLUDED.nota_final,
                            criterios = EXCLUDED.criterios,
                            feedback_professora = EXCLUDED.feedback_professora,
                            corrigido_em = EXCLUDED.corrigido_em
                    `, [
                        r.id, r.alunoId, r.alunoNome, r.alunoEmail, r.temaId, r.temaTitulo, r.vestibular,
                        r.arquivoNome, r.arquivoUrl, r.texto, r.status || 'pendente', r.notaFinal || null,
                        criteriosJson, r.feedbackProfessora || null,
                        r.enviadoEm || new Date().toISOString(), r.corrigidoEm || null
                    ]);
                }
            }
            return true;
        }

        if (caminho === paths.MATERIAS && Array.isArray(dados)) {
            const idsAtivos = dados.map(m => m.id);
            if (idsAtivos.length > 0) {
                await db.query("DELETE FROM materias WHERE id != ALL($1)", [idsAtivos]);
            }
            for (const m of dados) {
                await db.query(`
                    INSERT INTO materias (id, nome, descricao, ordem, icone, total_aulas, criado_em, atualizado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (id) DO UPDATE SET
                        nome = EXCLUDED.nome,
                        descricao = EXCLUDED.descricao,
                        ordem = EXCLUDED.ordem,
                        icone = EXCLUDED.icone,
                        total_aulas = EXCLUDED.total_aulas,
                        atualizado_em = EXCLUDED.atualizado_em
                `, [
                    m.id, m.nome, m.descricao || null, m.ordem || 1, m.icone || 'BookOpen',
                    m.totalAulas || 0, m.criadoEm || new Date().toISOString(), m.atualizadoEm || new Date().toISOString()
                ]);
            }
            return true;
        }

        if (caminho === paths.AULAS && Array.isArray(dados)) {
            const idsAtivos = dados.map(a => a.id);
            if (idsAtivos.length > 0) {
                await db.query("DELETE FROM aulas WHERE id != ALL($1)", [idsAtivos]);
            }
            for (const a of dados) {
                await db.query(`
                    INSERT INTO aulas (id, materia_id, titulo, subtitulo, conteudo, duracao, ordem, video_url, material_pdf_url, publicado, criado_em, atualizado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    ON CONFLICT (id) DO UPDATE SET
                        materia_id = EXCLUDED.materia_id,
                        titulo = EXCLUDED.titulo,
                        subtitulo = EXCLUDED.subtitulo,
                        conteudo = EXCLUDED.conteudo,
                        duracao = EXCLUDED.duracao,
                        ordem = EXCLUDED.ordem,
                        video_url = EXCLUDED.video_url,
                        material_pdf_url = EXCLUDED.material_pdf_url,
                        publicado = EXCLUDED.publicado,
                        atualizado_em = EXCLUDED.atualizado_em
                `, [
                    a.id, a.materiaId, a.titulo, a.subtitulo || null, a.conteudo || null,
                    a.duracao || '25 min', a.ordem || 1, a.videoUrl || null, a.materialPdfUrl || null,
                    a.publicado !== undefined ? a.publicado : true,
                    a.criadoEm || new Date().toISOString(), a.atualizadoEm || new Date().toISOString()
                ]);
            }
            return true;
        }

        if (caminho === paths.EXERCICIOS && Array.isArray(dados)) {
            const idsAtivos = dados.map(e => e.id);
            if (idsAtivos.length > 0) {
                await db.query("DELETE FROM exercicios WHERE id != ALL($1)", [idsAtivos]);
            }
            for (const e of dados) {
                const questoesJson = typeof e.questoes === 'string' ? e.questoes : JSON.stringify(e.questoes || []);
                await db.query(`
                    INSERT INTO exercicios (id, materia_id, aula_id, titulo, descricao, publicado, total_questoes, questoes, criado_em, atualizado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (id) DO UPDATE SET
                        materia_id = EXCLUDED.materia_id,
                        aula_id = EXCLUDED.aula_id,
                        titulo = EXCLUDED.titulo,
                        descricao = EXCLUDED.descricao,
                        publicado = EXCLUDED.publicado,
                        total_questoes = EXCLUDED.total_questoes,
                        questoes = EXCLUDED.questoes,
                        atualizado_em = EXCLUDED.atualizado_em
                `, [
                    e.id, e.materiaId || null, e.aulaId || null, e.titulo, e.descricao || null,
                    e.publicado !== undefined ? e.publicado : true,
                    Array.isArray(e.questoes) ? e.questoes.length : (e.totalQuestoes || 0),
                    questoesJson,
                    e.criadoEm || new Date().toISOString(), e.atualizadoEm || new Date().toISOString()
                ]);
            }
            return true;
        }

        if (caminho === paths.SIMULADOS && Array.isArray(dados)) {
            const idsAtivos = dados.map(s => s.id);
            if (idsAtivos.length > 0) {
                await db.query("DELETE FROM simulados WHERE id != ALL($1)", [idsAtivos]);
            }
            for (const s of dados) {
                const questoesJson = typeof s.questoes === 'string' ? s.questoes : JSON.stringify(s.questoes || []);
                await db.query(`
                    INSERT INTO simulados (id, titulo, descricao, banca, tempo_minutos, publicado, total_questoes, questoes, criado_em, atualizado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (id) DO UPDATE SET
                        titulo = EXCLUDED.titulo,
                        descricao = EXCLUDED.descricao,
                        banca = EXCLUDED.banca,
                        tempo_minutos = EXCLUDED.tempo_minutos,
                        publicado = EXCLUDED.publicado,
                        total_questoes = EXCLUDED.total_questoes,
                        questoes = EXCLUDED.questoes,
                        atualizado_em = EXCLUDED.atualizado_em
                `, [
                    s.id, s.titulo, s.descricao || null, s.banca || 'Geral', s.tempoMinutos || 60,
                    s.publicado !== undefined ? s.publicado : true,
                    Array.isArray(s.questoes) ? s.questoes.length : (s.totalQuestoes || 0),
                    questoesJson,
                    s.criadoEm || new Date().toISOString(), s.atualizadoEm || new Date().toISOString()
                ]);
            }
            return true;
        }

        if (caminho === paths.REDACOES && Array.isArray(dados)) {
            for (const r of dados) {
                const competenciasJson = typeof r.competencias === 'string' ? r.competencias : JSON.stringify(r.competencias || null);
                await db.query(`
                    INSERT INTO redacoes (id, usuario_id, aluno_nome, aluno_email, tema, texto, arquivo_url, status, nota_geral, competencias, feedback_professora, criado_em, atualizado_em, corrigido_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    ON CONFLICT (id) DO UPDATE SET
                        status = EXCLUDED.status,
                        nota_geral = EXCLUDED.nota_geral,
                        competencias = EXCLUDED.competencias,
                        feedback_professora = EXCLUDED.feedback_professora,
                        atualizado_em = EXCLUDED.atualizado_em,
                        corrigido_em = EXCLUDED.corrigido_em
                `, [
                    r.id, r.usuarioId || null, r.alunoNome || null, r.alunoEmail || null,
                    r.tema, r.texto || null, r.arquivoUrl || null,
                    r.status || 'pendente', r.notaGeral !== undefined ? r.notaGeral : null,
                    competenciasJson, r.feedbackProfessora || null,
                    r.criadoEm || new Date().toISOString(),
                    r.atualizadoEm || new Date().toISOString(),
                    r.corrigidoEm || null
                ]);
            }
            return true;
        }

        if (caminho === paths.TEMAS_REDACAO && Array.isArray(dados)) {
            const idsAtivos = dados.map(t => t.id);
            if (idsAtivos.length > 0) {
                await db.query("DELETE FROM temas_redacao WHERE id != ALL($1)", [idsAtivos]);
            }
            for (const t of dados) {
                const textosMotivadoresJson = typeof t.textosMotivadores === 'string' ? t.textosMotivadores : JSON.stringify(t.textosMotivadores || []);
                await db.query(`
                    INSERT INTO temas_redacao (id, titulo, foco, instrucoes, categoria, textos_motivadores, prazo, criado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (id) DO UPDATE SET
                        titulo = EXCLUDED.titulo,
                        foco = EXCLUDED.foco,
                        instrucoes = EXCLUDED.instrucoes,
                        categoria = EXCLUDED.categoria,
                        textos_motivadores = EXCLUDED.textos_motivadores,
                        prazo = EXCLUDED.prazo
                `, [
                    t.id, t.titulo, t.foco || null, t.instrucoes || null, t.categoria || null,
                    textosMotivadoresJson, t.prazo || null, t.criadoEm || new Date().toISOString()
                ]);
            }
            return true;
        }

        if (caminho === paths.MATERIAIS_APOIO && Array.isArray(dados)) {
            const idsAtivos = dados.map(m => m.id);
            if (idsAtivos.length > 0) {
                await db.query("DELETE FROM materiais_apoio WHERE id != ALL($1)", [idsAtivos]);
            }
            for (const m of dados) {
                await db.query(`
                    INSERT INTO materiais_apoio (id, titulo, descricao, modulo_id, categoria, tipo, tamanho, paginas, arquivo_url, download_url, criado_em)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    ON CONFLICT (id) DO UPDATE SET
                        titulo = EXCLUDED.titulo,
                        descricao = EXCLUDED.descricao,
                        modulo_id = EXCLUDED.modulo_id,
                        categoria = EXCLUDED.categoria,
                        tipo = EXCLUDED.tipo,
                        tamanho = EXCLUDED.tamanho,
                        paginas = EXCLUDED.paginas,
                        arquivo_url = EXCLUDED.arquivo_url,
                        download_url = EXCLUDED.download_url
                `, [
                    m.id, m.titulo, m.descricao || null, m.moduloId || null, m.categoria || null,
                    m.tipo || 'pdf', m.tamanho || null, m.paginas || null,
                    m.arquivoUrl || m.downloadUrl || null, m.downloadUrl || m.arquivoUrl || null,
                    m.criadoEm || new Date().toISOString()
                ]);
            }
            return true;
        }
    } catch (err) {
        console.warn("Aviso ao persistir no PostgreSQL:", err.message);
        return false;
    }

    return false;
}

// -----------------------------------------------------------------------------
// FUNÇÕES UNIVERSAIS (POSTGRESQL FIRST + FALLBACK FS)
// -----------------------------------------------------------------------------
async function lerArquivoJson(caminho) {
    const dadosPg = await lerDoPostgres(caminho);
    if (dadosPg !== null) {
        return dadosPg;
    }

    try {
        const conteudo = await fs.readFile(caminho, "utf8");
        const conteudoLimpo = conteudo.replace(/^\uFEFF/, "").trim();
        if (!conteudoLimpo) {
            return [];
        }
        const dados = JSON.parse(conteudoLimpo);
        return dados;
    } catch (erro) {
        if (erro.code === "ENOENT") {
            await fs.writeFile(caminho, "[]", "utf8");
            return [];
        }
        throw erro;
    }
}

async function salvarArquivoJson(caminho, dados) {
    // Sincroniza prioritariamente no PostgreSQL
    await salvarNoPostgres(caminho, dados);

    // Persiste também no disco/cache para failover seguro
    return runWithLock(caminho, async () => {
        try {
            await fs.writeFile(caminho, JSON.stringify(dados, null, 2), "utf8");
        } catch (err) {
            console.warn("Aviso ao salvar arquivo local:", err.message);
        }
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
        usuario.plano = "gratuito";
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
