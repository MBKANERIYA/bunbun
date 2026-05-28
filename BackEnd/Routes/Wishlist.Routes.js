let express = require("express")
const { wishlistController } = require("../Controllers")

let route = express.Router()

route.post("/createWishlist", wishlistController.createWishlist)
route.get("/getWishlist/:userId", wishlistController.getWishlist)
route.delete("/removeWishlist/:userId/:productId", wishlistController.removeFromWishlist)

module.exports = route