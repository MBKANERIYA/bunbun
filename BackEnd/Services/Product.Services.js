const { productSchema } = require("../Models")

module.exports.addProduct = async (body) => {
    if (Array.isArray(body)) {
        return productSchema.insertMany(body);
    } else {
        return productSchema.create(body);
    }
};

module.exports.getProduct = async () => {
    return productSchema.find()
}

module.exports.singleProduct = (id) => {
    return productSchema.findById(id)
}