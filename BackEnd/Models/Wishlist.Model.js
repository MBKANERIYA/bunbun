const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
        required: true
    },
    product: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productSchema",
                required: true
            }
        }
    ]
})

let wishlist = mongoose.model("wishlistSchema", wishlistSchema)

module.exports = wishlist