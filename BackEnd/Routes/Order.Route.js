let express = require("express")
const { orderController } = require("../Controllers")

let route = express.Router()

route.post("/createOrder", orderController.createOrder)

module.exports = route