let express = require("express")
const { orderController } = require("../Controllers")

let route = express.Router()

route.post("/createOrder", orderController.createOrder)
route.get("/user/:userId", orderController.getUserOrders)
route.get("/getAllOrders", orderController.getAllOrders)

module.exports = route