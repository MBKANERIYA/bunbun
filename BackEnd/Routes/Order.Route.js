let express = require("express")
const { orderController } = require("../Controllers")
const { tokenVeryfy, isAdmin, isOwner } = require("../Middleware/jwtVeryfy")

let route = express.Router()

route.post("/createOrder", orderController.createOrder)
route.get("/user/:userId", tokenVeryfy, isOwner, orderController.getUserOrders)
route.get("/getAllOrders", tokenVeryfy, isAdmin, orderController.getAllOrders)

module.exports = route