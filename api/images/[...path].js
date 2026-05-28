const app = require("../../BackEnd/App")

module.exports = (req, res) => {
    // Vercel sends the full path including /api prefix — strip it
    // so Express sees /images/... which matches the app routes
    req.url = req.url.replace(/^\/api\/images/, "/images")
    return app(req, res)
}
