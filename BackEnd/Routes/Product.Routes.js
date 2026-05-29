let express = require("express")
const { productController } = require("../Controllers")
const upload = require("../Middleware/multer")

let route = express.Router()


route.post("/addProduct", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), (req, res, next) => {
    req.body = Object.assign({}, req.body);
    next();
}, productController.addProduct)
route.put("/updateProduct/:id", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), (req, res, next) => {
    req.body = Object.assign({}, req.body);
    next();
}, productController.updateProduct)
route.get("/getProduct", productController.getProduct)
route.delete("/deleteProduct/:id", productController.deleteProduct)
route.post("/filterProduct", productController.filterProduct)
route.get("/singleProduct/:productId", productController.getSingleProduct)

module.exports = route