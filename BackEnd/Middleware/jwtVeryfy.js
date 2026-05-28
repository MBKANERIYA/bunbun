const jwt = require("jsonwebtoken")

module.exports.tokenVeryfy = (req, res, next) => {

    const token = req.headers["auth"]
    if (!token) {
        return res.status(404).json({ message: "you are unauthorize" })
    }

    const decodeToken = token.split(" ")[1]
    jwt.verify(decodeToken, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(404).json({ message: "wrong token" })
        }
        req.user = decode.user
        next()
    })
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next()
    } else {
        return res.status(500).json({ message: "you have no access" })
    }
}