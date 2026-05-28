const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { UserService } = require("../Services")
const { userSchema } = require("../Models")
let jwt = require("jsonwebtoken")
let nodemailer = require("nodemailer")

module.exports.RegisterUser = async (req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        res.status(400).json({
            error: error.array()
        })
    }

    try {
        const { fullName, email, password, mobileNumber, gender, dateOfBirth } = req.body;

        const duplicateUser = await userSchema.findOne({ email }, { mobileNumber })
        if (duplicateUser) {
            res.status(400).json({
                message: "User Already Registerd"
            })
        }

        const User = await UserService.CreateUser(req.body)

        let token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET);
        console.log(token);

        await User.save()

        res.status(201).json({
            message: "User Registered Successfully",
            User,
            token
        })
    } catch (err) {
        res.status(500).json({
            err: err.message
        })
    }
}

// Edit User Profile
module.exports.editUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, mobileNumber, gender, dateOfBirth } = req.body;

        // Find user by ID
        let user = await userSchema.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (fullName) user.fullName = fullName;
        if (mobileNumber) user.mobileNumber = mobileNumber;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;

        await user.save();

        res.status(200).json({
            message: "User profile updated successfully",
            user
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


module.exports.userProfile = async (req, res) => {
    try {
        const { id } = req.params

        let userProfile = await UserService.getUserProfile(id)

        res.status(200).json({
            message: "User Profile Get Successfully",
            userProfile
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.getUsers = async (req, res) => {
    try {
        let allUsers = await UserService.getAllUsera()

        res.status(200).json({
            message: "Get All Users Successfully",
            allUsers
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userSchema.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            message: "Login successful",
            token,
            user: userWithoutPassword
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const otpStore = {};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const generateOtp = () => crypto.randomInt(1000, 9999).toString();

module.exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOtp();
        otpStore[email] = otp;

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
        });

        res.status(200).json({ message: "OTP sent to email successfully" });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports.verifyOtpAndResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, otp, newPassword } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (otpStore[email] !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        delete otpStore[email];

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};
