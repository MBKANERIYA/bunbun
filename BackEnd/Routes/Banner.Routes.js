let express = require("express")
const { bannerControler } = require("../Controllers")

let route = express.Router()

route.post("/addBanner", bannerControler.CreateBanner)
route.get("/getBanner", bannerControler.getBanner)

module.exports = route