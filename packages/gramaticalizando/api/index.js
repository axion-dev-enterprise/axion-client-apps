const app = require("../server/app");

function collectBody(req) {
    return new Promise(resolve => {
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
            return resolve();
        }
        if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS" || req.method === "DELETE") {
            return resolve();
        }
        if (req.readableEnded || req.complete) {
            req.body = req.body || {};
            req._body = true;
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
            } else {
                req.body = req.body || {};
            }
            req._body = true;
            resolve();
        });
        req.on("error", () => {
            req.body = req.body || {};
            req._body = true;
            resolve();
        });
    });
}

module.exports = async function handler(req, res) {
    await collectBody(req);
    return app(req, res);
};

