let mongoose = require("mongoose")

let ratingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productSchema",
        required: true
    },
    ratings: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserSchema",
            required: true
        },
        userRating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        userReview: {
            type: String,
        },
        productImage: {
            type: String
        }
    }],
    rating: {
        type: Number
    },

}, { timestamps: true })

let rating = mongoose.models.ratingSchema || mongoose.model("ratingSchema", ratingSchema)

module.exports = rating
