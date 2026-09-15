function errorHandler(err, req, res, next) {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        type: "https://axionenterprise.cloud/errors/internal",
        title: "Erro Interno do Servidor",
        status: err.status || 500,
        detail: err.message || "Ocorreu um erro inesperado no processamento.",
        sucesso: false,
        mensagem: err.message || "Erro interno do servidor."
    });
}

module.exports = errorHandler;
