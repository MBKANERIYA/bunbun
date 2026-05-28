const { bannerSchema } = require("../Models")

module.exports.AddBanner = async (body) => {
    return bannerSchema.create(body)
}

module.exports.getBanner = async () => {
    return bannerSchema.findOne()
}