let express = require("express")
const { cartController } = require("../Controllers")

let route = express.Router()

route.post("/createCart", cartController.createCart)
route.get("/getCart/:userId", cartController.getCart)
route.put("/update-quantity", cartController.updateCartQuantity)
route.delete("/remove/:userId/:productId", cartController.removeFromCart)

module.exports = route