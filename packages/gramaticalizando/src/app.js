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
    if (req.body && typeof req.body === "object") {
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
        }
        next();
    });
    req.on("error", () => {
        next();
    });
});
app.use(express.urlencoded({ extended: true }));

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

// Páginas administrativas protegidas
app.get("/admin.html", protegerPaginaAdmin, (req, res) => {
    res.sendFile(path.join(paths.PUBLIC_DIR, "admin.html"));
});
app.get("/editor-aula.html", protegerPaginaAdmin, (req, res) => {
    res.sendFile(path.join(paths.PUBLIC_DIR, "editor-aula.html"));
});
app.get("/editor-exercicio.html", protegerPaginaAdmin, (req, res) => {
    res.sendFile(path.join(paths.PUBLIC_DIR, "editor-exercicio.html"));
});

// Arquivos estáticos da pasta public (sem index automático para respeitar a raiz)
app.use(express.static(paths.PUBLIC_DIR, { index: false }));

// Rotas de API
app.use("/api", routes);

// Rota raiz serve a landing page
app.get("/", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC_DIR, "index.html"));
});

// Error Handler Centralizado
app.use(errorHandler);

module.exports = app;
