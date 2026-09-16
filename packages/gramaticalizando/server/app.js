const express = require("express");
const session = require("express-session");
const path = require("path");
const env = require("./config/env");
const paths = require("./config/paths");
const routes = require("./routes");
const { protegerPaginaAdmin } = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Habilita confiança em proxies reversos (Cloudflare + Traefik) para emissão correta de cookies secure
app.set("trust proxy", 1);

// Middleware de parsing JSON e urlencoded de alta capacidade (25MB para PDFs e redações escaneadas)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Fallback compatível para buffers/strings residuais
app.use((req, res, next) => {
    if (typeof req.body === "string" && req.body.trim().startsWith("{")) {
        try {
            req.body = JSON.parse(req.body);
        } catch {}
    }
    next();
});

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 8 // 8 horas
        }
    })
);

// Redirecionamento canônico do painel admin legado para o portal moderno do professor
app.get(["/admin", "/admin.html"], (req, res) => {
    res.redirect("/professor");
});

// Servir arquivos estáticos do build SPA (dist) e pasta public
const DIST_DIR = path.join(paths.ROOT_DIR, "dist");
if (require("fs").existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
}
app.use(express.static(paths.PUBLIC_DIR, { index: false }));

// Healthcheck canônico para Traefik e Uptime Kuma
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "gramaticalizando-lms",
        database: require("./db").isDbReady() ? "connected_postgresql" : "fallback_mode",
        timestamp: new Date().toISOString()
    });
});

// Rotas de API (suporta com e sem prefixo /api em serverless)
app.use("/api", routes);
app.use(routes);

// Fallback SPA: serve dist/index.html para qualquer rota não-API (Express 5 safe)
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }
    const distIndex = path.join(DIST_DIR, "index.html");
    if (require("fs").existsSync(distIndex)) {
        return res.sendFile(distIndex);
    }
    res.status(200).send("Gramaticalizando SPA Engine Ready. Execute vite build para gerar dist/index.html.");
});

// Error Handler Centralizado
app.use(errorHandler);

module.exports = app;
