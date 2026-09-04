// api/consumer-logs.js
// Endpoint para visualizar os logs de requests do Consumer Desktop

const LOG_GIST_ID = process.env.GH_LOG_GIST_ID || "";
const GIST_TOKEN = process.env.GH_GIST_TOKEN || "";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  // Limpa logs via DELETE
  if (req.method === "DELETE") {
    if (!LOG_GIST_ID || !GIST_TOKEN) return res.status(500).json({ error: "GH_LOG_GIST_ID not configured" });
    await fetch(`https://api.github.com/gists/${LOG_GIST_ID}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${GIST_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "AnneTomPOS"
      },
      body: JSON.stringify({ files: { "consumer_logs.json": { content: "[]" } } })
    });
    return res.status(200).json({ ok: true, message: "Logs limpos." });
  }

  if (!LOG_GIST_ID || !GIST_TOKEN) {
    return res.status(500).json({ error: "GH_LOG_GIST_ID not configured" });
  }

  try {
    const r = await fetch(`https://api.github.com/gists/${LOG_GIST_ID}`, {
      headers: {
        "Authorization": `Bearer ${GIST_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "AnneTomPOS"
      },
      cache: "no-store"
    });

    if (!r.ok) return res.status(502).json({ error: "Gist error", status: r.status });

    const gist = await r.json();
    const raw = gist?.files?.["consumer_logs.json"]?.content || "[]";
    const logs = JSON.parse(raw);
    return res.status(200).json({ count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
