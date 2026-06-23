let express = require("express");
const { chatbotController } = require("../Controllers");
const tryOnController = require("../Controllers/TryOn.Controller");
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

route.post("/try-on/generate", tokenVeryfy, tryOnController.generateTryOn);
route.get("/try-on/products", tryOnController.getTryOnProducts);

route.get("/try-on/status", (req, res) => {
    const enabled = Boolean(process.env.GEMINI_API_KEY);
    res.status(200).json({
        enabled,
        message: enabled
            ? "AI Try-On is ready. Upload a photo and select a product to try on."
            : "AI Try-On requires a Gemini API key to be configured.",
    });
});

module.exports = route;
