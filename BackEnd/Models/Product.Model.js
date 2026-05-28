let mongoose = require("mongoose")

let productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    mrp: {
        type: String
    },
    selling_price: {
        type: String
    },
    category: {
        type: String
    },
    subcategory: {
        type: String
    },
    description: {
        type: String
    },
    color: {
        type: String
    }
})

let product = mongoose.model("productSchema", productSchema)

module.exports = product