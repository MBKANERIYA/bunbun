let express = require("express");
const { chatbotController } = require("../Controllers");
const chatbotUpload = require("../Middleware/chatbotUpload");
const { tokenVeryfy } = require("../Middleware/jwtVeryfy");

let route = express.Router();

const uploadClothingImage = (req, res, next) => {
    chatbotUpload.single("clothingImage")(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    });
};

route.post(
    "/suggestions",
    tokenVeryfy,
    uploadClothingImage,
    chatbotController.getProductSuggestions
);

route.get("/try-on/status", (req, res) => {
    res.status(200).json({
        enabled: process.env.AI_TRY_ON_ENABLED === "true",
        message: "AI Try-On will be available once Atomesus supports documented image generation for API users.",
    });
});

module.exports = route;
