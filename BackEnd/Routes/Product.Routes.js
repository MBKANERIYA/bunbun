let express = require("express")
const { productController } = require("../Controllers")
const upload = require("../Middleware/multer")

let route = express.Router()
const MAX_ADDITIONAL_IMAGES = 10;

route.post("/uploadImage", upload.single("image"), productController.uploadProductImage)

route.post("/addProduct", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: MAX_ADDITIONAL_IMAGES }
]), (req, res, next) => {
    req.body = Object.assign({}, req.body);
    next();
}, productController.addProduct)
route.put("/updateProduct/:id", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: MAX_ADDITIONAL_IMAGES }
]), (req, res, next) => {
    req.body = Object.assign({}, req.body);
    next();
}, productController.updateProduct)
route.get("/getProduct", productController.getProduct)
route.delete("/deleteProduct/:id", productController.deleteProduct)
route.post("/filterProduct", productController.filterProduct)
route.get("/singleProduct/:productId", productController.getSingleProduct)

route.get('/singleProductBySlug/:slug', productController.getSingleProductBySlug)

module.exports = route
