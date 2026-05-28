require("dotenv").config()
let express = require("express")
let bodyParser = require("body-parser")
let http = require("http")
let cors = require("cors")
const dbConnect = require("./Config/DbConnect")
const router = require("./Routes")

let app = express()
let startupTimeoutMS = 15000

app.use(cors())
app.use(bodyParser.json())
app.use("/images", express.static("public/images"))
app.use("/v1", router)

let withTimeout = (promise, timeoutMS) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Database connection timed out after ${timeoutMS / 1000} seconds`))
            }, timeoutMS)
        })
    ])
}

let startServer = async () => {
    try {
        await withTimeout(dbConnect(), startupTimeoutMS)

        http.createServer(app).listen(process.env.PORT, () => {
            console.log(`Server successfully Started on ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Failed to start server:", error.message)
        process.exit(1)
    }
}

startServer()

