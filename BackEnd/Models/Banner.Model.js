const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    banners: {
        topBanner: {
            type: String,
            required: true
        },
        trendingBanner: {
            type: String,
            required: true
        },
        bestSellerBanner: {
            type: String,
            required: true
        },
        exclusiveCollectionBanner: {
            type: String,
            required: true
        }
    },
    categoryImages: [
        {
            type: String,
            required: false
        }
    ]
}, { timestamps: true });

const Banner = mongoose.models.bannerSchema || mongoose.model("bannerSchema", bannerSchema);

module.exports = Banner;
