const User = require("../models/user")
const { StatusCodes } = require('http-status-codes');
const { badRequest, unauthorized } = require('../utils/error');

const register = async (req, res) => {

    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ username: user.username, token })
}


const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        throw badRequest('Invalid email or password')
    }
    const token = user.comparePassword(password)

    if (!token) {
        throw unauthorized('Invalid credentials')
    }
    res.status(StatusCodes.OK).json({ username: user.username, token })
}

module.exports = { register, login }