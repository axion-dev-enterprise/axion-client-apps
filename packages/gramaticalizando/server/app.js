const express = require("express");
const session = require("express-session");
const path = require("path");
const env = require("./config/env");
const paths = require("./config/paths");
const routes = require("./routes");
const { protegerPaginaAdmin } = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware resiliente de parsing JSON compatível com Express 5 e Vercel Serverless
app.use((req, res, next) => {
    if (typeof req.body === "string") {
        try {
            req.body = JSON.parse(req.body);
        } catch {}
    }
    if (Buffer.isBuffer(req.body)) {
        try {
            req.body = JSON.parse(req.body.toString("utf8"));
        } catch {}
    }
    if (req.body && typeof req.body === "object") {
        req._body = true;
        return next();
    }
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS" || req.method === "DELETE") {
        return next();
    }
    if (req.readableEnded || req.complete) {
        req.body = req.body || {};
        req._body = true;
        return next();
    }
    let data = "";
    req.on("data", chunk => {
        data += chunk;
    });
    req.on("end", () => {
        if (data) {
            try {
                req.body = JSON.parse(data);
            } catch {
                req.body = {};
            }
        } else {
            req.body = req.body || {};
        }
        req._body = true;
        next();
    });
    req.on("error", () => {
        req.body = req.body || {};
        req._body = true;
        next();
    });
});
app.use((req, res, next) => {
    if (req._body) {
        return next();
    }
    express.urlencoded({ extended: true })(req, res, next);
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
