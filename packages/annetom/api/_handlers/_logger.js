// api/_logger.js
// Logger de requests para capturar exatamente o que o Consumer Desktop envia

const LOG_GIST_ID = process.env.GH_LOG_GIST_ID || "";
const GIST_TOKEN = process.env.GH_GIST_TOKEN || "";

const MAX_LOGS = 50; // mantém os últimos 50 logs

/**
 * Captura todos os dados relevantes de uma requisição HTTP
 */
function captureRequest(req, context = "") {
  const now = new Date().toISOString();

  const headers = {};
  for (const [key, val] of Object.entries(req.headers || {})) {
    headers[key] = val;
  }

  let body = null;
  if (req.body && typeof req.body === "object") {
    body = req.body;
  } else if (req.body && typeof req.body === "string") {
    try { body = JSON.parse(req.body); } catch { body = req.body; }
  }

  return {
    ts: now,
    context,
    method: req.method,
    path: req.url,
    query: req.query || {},
    headers,
    body,
  };
}

/**
 * Salva log no Gist dedicado
 */
async function saveLog(entry) {
  if (!LOG_GIST_ID || !GIST_TOKEN) {
    console.log("[Logger] GH_LOG_GIST_ID não configurado, log apenas no console.");
    console.log("[Logger] Entrada:", JSON.stringify(entry, null, 2));
    return;
  }

  try {
    // Lê logs existentes
    const res = await fetch(`https://api.github.com/gists/${LOG_GIST_ID}`, {
      headers: {
        "Authorization": `Bearer ${GIST_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "AnneTomPOS"
      },
      cache: "no-store"
    });

    let logs = [];
    if (res.ok) {
      const gist = await res.json();
      const raw = gist?.files?.["consumer_logs.json"]?.content;
      if (raw) {
        try { logs = JSON.parse(raw); } catch { logs = []; }
      }
    }

    // Adiciona novo log no início (mais recente primeiro)
    logs.unshift(entry);
    if (logs.length > MAX_LOGS) logs = logs.slice(0, MAX_LOGS);

    // Salva no Gist
    await fetch(`https://api.github.com/gists/${LOG_GIST_ID}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${GIST_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "AnneTomPOS"
      },
      body: JSON.stringify({
        files: {
          "consumer_logs.json": {
            content: JSON.stringify(logs, null, 2)
          }
        }
      })
    });
  } catch (err) {
    console.warn("[Logger] Erro ao salvar log:", err.message);
  }
}

module.exports = { captureRequest, saveLog };
