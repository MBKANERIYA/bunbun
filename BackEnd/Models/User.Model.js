let mongoose = require("mongoose")

let UserSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minLength: [3, "minimum length must be atleast 3 character long"]
        },
        lastName: {
            type: String,
            required: true,
            minLength: [3, "minimum length must be atleast 3 character long"]
        },
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one special character"
        ],
        select: false
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
        unique: true,
        match: [
            /^[6-9]\d{9}$/,
            "Please enter a valid 10-digit Indian mobile number"
        ]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: {
            values: ["Male", "Female", "Other"],
            message: "Gender must be either Male, Female, or Other"
        }
    },
    dateOfBirth: {
        type: Date
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    }
}, { timestamps: true })

let User = mongoose.model("UserSchema", UserSchema)

module.exports = User