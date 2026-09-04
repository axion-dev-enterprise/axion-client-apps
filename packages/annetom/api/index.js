// Consolidated single Serverless Function for Vercel Hobby plan (max 12 functions)
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const urlPath = (req.url || "").split("?")[0].replace(/^\/api\/?/, "");
  const routeName = urlPath.split("/")[0] || "health";

  const handlerPath = path.join(__dirname, "_handlers", `${routeName}.js`);

  if (fs.existsSync(handlerPath)) {
    try {
      const handler = require(handlerPath);
      return await handler(req, res);
    } catch (err) {
      console.error(`Error in API handler [${routeName}]:`, err);
      return res.status(500).json({ error: "internal_server_error", message: err.message });
    }
  }

  return res.status(404).json({ error: "not_found", route: routeName });
};
