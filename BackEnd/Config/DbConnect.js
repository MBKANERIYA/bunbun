let mongoose = require("mongoose")

let cachedConnectionPromise = null

let dbConnect = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    if (cachedConnectionPromise) {
        return cachedConnectionPromise
    }

    if (!process.env.DB_URL) {
        throw new Error("DB_URL is missing from the environment")
    }

    cachedConnectionPromise = mongoose.connect(process.env.DB_URL, {
        serverSelectionTimeoutMS: 10000
    })
        .then((connection) => {
            console.log("Server successfully connected with Data-Base")
            return connection
        })
        .catch((error) => {
            cachedConnectionPromise = null
            throw error
        })

    return cachedConnectionPromise
}

module.exports = dbConnect
