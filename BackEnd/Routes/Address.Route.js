let express = require("express")
const { addressController } = require("../Controllers")
const { tokenVeryfy, isOwner } = require("../Middleware/jwtVeryfy")

let route = express.Router()

route.use(tokenVeryfy)

route.post("/add", isOwner, addressController.addAddress)
route.get("/getAdd/:userId", isOwner, addressController.getAddresses)

module.exports = route