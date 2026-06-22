let express = require("express")
const { body } = require("express-validator")
const { UserController } = require("../Controllers");
const { isAdmin, isOwner, tokenVeryfy } = require("../Middleware/jwtVeryfy");

let route = express.Router()

route.post("/Register", [
    body("email")
        .isEmail()
        .withMessage("Invalid Email Id"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/)
        .withMessage("Password must contain 1 uppercase, 1 lowercase, and 1 special character"),

    body("mobileNumber")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Please enter a valid 10-digit Indian mobile number"),

    body("fullName.firstName")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters"),
    body("fullName.lastName")
        .isLength({ min: 3 })
        .withMessage("Last name must be at least 3 characters"),

    body("gender")
        .optional()
        .isIn(["Male", "Female", "Other"])
        .withMessage("Gender must be Male, Female, or Other"),
], UserController.RegisterUser);

route.get("/UserProfile/:id", tokenVeryfy, isOwner, UserController.userProfile)

route.get("/allUsers", tokenVeryfy, isAdmin, UserController.getUsers)

route.post("/login", UserController.loginUser);

route.post("/forgot-password", UserController.forgotPassword);
route.post("/reset-password", body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"), UserController.verifyOtpAndResetPassword);
route.post("/updateUser/:id", tokenVeryfy, isOwner, UserController.editUserProfile)

// Mobile OTP Login
route.post("/send-login-otp", UserController.sendLoginOtp);
route.post("/verify-login-otp", UserController.verifyLoginOtp);
route.post("/firebase-login", UserController.firebaseLogin);

module.exports = route
