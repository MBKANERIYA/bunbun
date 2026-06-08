let express = require("express")
const upload = require("../Middleware/multer")
const { ratingController } = require("../Controllers")

let route = express.Router()

route.post("/addRating", upload.single("productImage"), ratingController.addRating)
route.get("/getRating/:productId", ratingController.getRatings)
route.get("/getAllReviews", ratingController.getAllReviews)

module.exports = route