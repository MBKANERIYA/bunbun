const app = require("../BackEnd/App")

module.exports = (req, res) => {
    if (req.url.startsWith("/api/")) {
        req.url = req.url.replace(/^\/api/, "")
    }
    return app(req, res)
}
