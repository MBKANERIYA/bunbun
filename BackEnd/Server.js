const dbConnect = require("./Config/DbConnect")
const app = require("./App")
let startupTimeoutMS = 15000

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

        let port = process.env.PORT || 4000
        app.listen(port, () => {
            console.log(`Server successfully Started on ${port}`);
        })
    } catch (error) {
        console.error("Failed to start server:", error.message)
        process.exit(1)
    }
}

startServer()

