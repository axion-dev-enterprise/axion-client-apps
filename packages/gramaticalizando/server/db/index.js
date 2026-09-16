const { Pool } = require("pg");

const defaultDbUrl = process.env.DATABASE_URL || 
    (process.env.POSTGRES_HOST
        ? `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || ''}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'gramaticalizando_db'}`
        : null);

let pool = null;
let isConnected = false;

if (defaultDbUrl) {
    try {
        pool = new Pool({
            connectionString: defaultDbUrl,
            connectionTimeoutMillis: 4000,
            idleTimeoutMillis: 30000,
            max: 10
        });

        pool.on("error", (err) => {
            console.warn("PostgreSQL Pool Warning:", err.message);
        });

        pool.query("SELECT NOW()")
            .then(() => {
                isConnected = true;
                console.log("PostgreSQL gramaticalizando_db conectado com sucesso!");
            })
            .catch((err) => {
                console.warn("PostgreSQL não acessível diretamente neste host, operando com fallback resiliente:", err.message);
            });
    } catch (err) {
        console.warn("Falha ao inicializar pool PG:", err.message);
    }
}

async function query(text, params) {
    if (!pool) throw new Error("Pool PostgreSQL não inicializado.");
    return pool.query(text, params);
}

function getPool() {
    return pool;
}

function isDbReady() {
    return Boolean(pool && isConnected);
}

module.exports = {
    pool,
    query,
    getPool,
    isDbReady
};
