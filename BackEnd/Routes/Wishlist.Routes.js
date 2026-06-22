let express = require("express")
const { wishlistController } = require("../Controllers")
const { tokenVeryfy, isOwner } = require("../Middleware/jwtVeryfy")

let route = express.Router()

route.use(tokenVeryfy)

route.post("/createWishlist", isOwner, wishlistController.createWishlist)
route.get("/getWishlist/:userId", isOwner, wishlistController.getWishlist)
route.delete("/removeWishlist/:userId/:productId", isOwner, wishlistController.removeFromWishlist)

module.exports = route