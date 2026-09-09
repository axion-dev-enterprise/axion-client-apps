const app = require("../src/app");

function collectBody(req) {
    return new Promise(resolve => {
        if (req.body && typeof req.body === "object") {
            return resolve();
        }
        if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS" || req.method === "DELETE") {
            return resolve();
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
            resolve();
        });
        req.on("error", () => {
            req.body = {};
            resolve();
        });
    });
}

module.exports = async function handler(req, res) {
    await collectBody(req);
    return app(req, res);
};
