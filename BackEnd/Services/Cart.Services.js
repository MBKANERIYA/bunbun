const { cartSchema } = require("../Models")

module.exports.createCart = async (body) => {
    return cartSchema.create(body)
}

module.exports.getCartByUserId = async (userId) => {
    return await cartSchema.findOne({ userId })
        .populate({
            path: "userId",
        })
        .populate({
            path: "product.productId",
        });
};
