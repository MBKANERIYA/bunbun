const multer = require("multer");
const os = require("os");

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
]);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        const extension = (file.originalname.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase();
        cb(null, `bunbun-chatbot-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`);
    },
});

const chatbotUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, and WebP images are supported."));
        }
        cb(null, true);
    },
});

module.exports = chatbotUpload;
