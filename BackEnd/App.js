require("dotenv").config({ path: require("path").join(__dirname, ".env") })

let express = require("express")
let bodyParser = require("body-parser")
let cors = require("cors")
let path = require("path")
const dbConnect = require("./Config/DbConnect")
const router = require("./Routes")

let app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '25mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }))
app.use("/images", express.static(path.join(__dirname, "public/images")))

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

app.use("/v1", async (req, res, next) => {
    try {
        await dbConnect()
        next()
    } catch (error) {
        console.error("Database connection failed:", error.message)
        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        })
    }
})

app.use("/v1", router)

// Serve Frontend Static Files
const frontendBuildPath = path.join(__dirname, "../FrontEnd/dist");
app.use(express.static(frontendBuildPath));

// Catch-all route for React Router (must be placed AFTER API routes)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
});

module.exports = app
