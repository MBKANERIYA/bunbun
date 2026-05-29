const bcrypt = require("bcryptjs")
const { userSchema } = require("../Models")
// const UserSchema = require("../Models")

module.exports.CreateUser = async (body) => {
    let { password } = body

    let hashPassword = await bcrypt.hash(password, 10)

    let newBody = {
        ...body,
        password: hashPassword
    }

    return userSchema.create(newBody)
}

module.exports.getUserProfile = async (id) => {
    return userSchema.findById(id)
}

module.exports.getAllUsera = async () => {
    return userSchema.find()
}