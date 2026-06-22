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
        // Normalize req.user with direct userId and role fields
        req.user = {
            userId: decode.userId || decode._id,
            role: decode.role || "User"
        };
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

module.exports.isOwner = (req, res, next) => {
    const userId = req.params.userId || req.body.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    if (req.user.userId !== userId && req.user.role !== "Admin") {
        return res.status(403).json({ message: "You do not have permission to access this resource" });
    }
    next();
}