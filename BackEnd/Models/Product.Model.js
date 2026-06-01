let mongoose = require("mongoose")

let productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    images: [{
        type: String
    }],
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
    },
    sku: {
        type: String
    },
    productType: {
        type: String
    },
    blouseType: {
        type: String
    },
    blouseColor: {
        type: String
    },
    blouseFabric: {
        type: String
    },
    blouseWork: {
        type: String
    },
    sleeveLength: {
        type: String
    },
    bustSize: {
        type: String
    },
    blouseLength: {
        type: String
    },
    washAndCare: {
        type: String
    },
    salesPackage: {
        type: String
    },
    weight: {
        type: String
    },
    bottomColor: {
        type: String
    },
    bottomFabric: {
        type: String
    },
    bottomLength: {
        type: String
    },
    bottomWork: {
        type: String
    },
    waistType: {
        type: String
    },
    bottomHip: {
        type: String
    },
    bottomWaist: {
        type: String
    }
})

let product = mongoose.model("productSchema", productSchema)

module.exports = product