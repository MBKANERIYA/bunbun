const { wishlistSchema } = require("../Models")

module.exports.createWishlist = async (body) => {
    return wishlistSchema.create(body)
}

module.exports.getWishlist = async (userId) => {
    return await wishlistSchema.findOne({ userId })
        .populate({
            path: "userId",
        })
        .populate({
            path: "product.productId",
        });
}
