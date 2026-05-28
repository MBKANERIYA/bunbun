const { bannerService } = require("../Services")

module.exports.CreateBanner = async (req, res) => {
    try {
        const body = req.body

        let banner = await bannerService.AddBanner(body)

        res.status(201).json({
            message: "Add Banner Successfully",
            banner
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.getBanner = async (req, res) => {
    try {
        let banner = await bannerService.getBanner()

        res.status(200).json({
            message: "Get all Banner Successfully",
            banner
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}