let mongoose = require("mongoose")

let dbConnect = async () => {
    if (!process.env.DB_URL) {
        throw new Error("DB_URL is missing from the environment")
    }

    await mongoose.connect(process.env.DB_URL, {
        serverSelectionTimeoutMS: 10000
    })
    console.log("Server successfully connected with Data-Base");
}

module.exports = dbConnect
