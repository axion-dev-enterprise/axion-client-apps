const app = require("./app");
const env = require("./config/env");

app.listen(env.PORT, () => {
    console.log(`[Gramaticalizando] Servidor modular rodando em http://localhost:${env.PORT} (ambiente: ${env.NODE_ENV})`);
});
