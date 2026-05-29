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

module.exports.updateProduct = (id, body) => {
    return productSchema.findByIdAndUpdate(id, body, { new: true });
}

module.exports.deleteProduct = (id) => {
    return productSchema.findByIdAndDelete(id);
}