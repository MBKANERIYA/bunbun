const app = require("../../BackEnd/App")

module.exports = (req, res) => {
    req.url = req.url.replace(/^\/api/, "")
    return app(req, res)
}
