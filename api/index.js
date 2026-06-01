let app;
try {
    app = require("../BackEnd/App");
} catch (error) {
    console.error("Failed to load BackEnd App:", error);
}

module.exports = (req, res) => {
    if (req.headers['x-invoke-path']) {
        req.url = req.headers['x-invoke-path'];
    }
    
    if (req.url.startsWith("/api/")) {
        req.url = req.url.replace(/^\/api/, "");
    }
    
    if (!app) {
        return res.status(500).json({ error: "Backend application failed to initialize." });
    }
    
    return app(req, res);
}
