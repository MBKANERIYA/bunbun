const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
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
            },
            quantity: {
                type: Number,
                default: 1
            },
            size: {
                type: String
            },
            totalPrice: {
                type: Number
            }
        }
    ],
    cartTotal: {
        type: Number
    }
})

let cart = mongoose.models.cartSchema || mongoose.model("cartSchema",cartSchema)

module.exports = cart