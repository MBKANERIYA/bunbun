let express = require("express")
const { addressController } = require("../Controllers")

let route = express.Router()

route.post("/add", addressController.addAddress)
route.get("/getAdd/:userId", addressController.getAddresses)

module.exports = route