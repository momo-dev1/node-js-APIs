const User = require("../models/user")
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({ user })
}


const login = async (req, res) => {
    res.status(StatusCodes.CREATED).json({ msg: { ...req.body } })
}


module.exports = { register, login }