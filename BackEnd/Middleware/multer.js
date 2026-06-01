const multer = require("multer")
let fs = require("fs");
let path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tmpDir = require('os').tmpdir();
        cb(null, tmpDir);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.originalname + "-" + parseInt(Math.random() * 10000) + ".png"
        );
    },
});

const upload = multer({ storage: storage });

module.exports = upload;