const app = require("../BackEnd/App")

module.exports = (req, res) => {
    // Check if req.url starts with /api (some Vercel edge cases)
    if (req.url.startsWith("/api/")) {
        req.url = req.url.replace(/^\/api/, "")
    }

    // Pass to Express
    return app(req, res)
}
