const app = require("../../BackEnd/App")

module.exports = (req, res) => {
    // Vercel sends the full path including /api prefix — strip it
    // so Express sees /v1/... which matches the app routes
    req.url = req.url.replace(/^\/api\/v1/, "/v1")
    return app(req, res)
}
