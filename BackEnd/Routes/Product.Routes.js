let express = require("express")
const { productController } = require("../Controllers")

let route = express.Router()


route.post("/addProduct", productController.addProduct)
route.get("/getProduct", productController.getProduct)
route.post("/filterProduct", productController.filterProduct)
route.get("/singleProduct/:productId", productController.getSingleProduct)

module.exports = route