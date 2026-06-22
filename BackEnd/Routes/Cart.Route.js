let express = require("express")
const { cartController } = require("../Controllers")
const { tokenVeryfy, isOwner } = require("../Middleware/jwtVeryfy")

let route = express.Router()

route.use(tokenVeryfy)

route.post("/createCart", isOwner, cartController.createCart)
route.get("/getCart/:userId", isOwner, cartController.getCart)
route.put("/update-quantity", isOwner, cartController.updateCartQuantity)
route.delete("/remove/:userId/:productId", isOwner, cartController.removeFromCart)
route.delete("/clear/:userId", isOwner, cartController.clearCart)

module.exports = route