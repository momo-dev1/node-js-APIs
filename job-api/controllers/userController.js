import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Job from "../models/Job.js";

const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

const getApplicationStats = async (req, res) => {
    const jobCount = await Job.countDocuments();
    const userCount = await User.countDocuments();

    res
        .status(StatusCodes.OK)
        .json({ jobs: jobCount, users: userCount });
};

const updateUser = async (req, res) => {
    const { userId } = req.user;
    const userObj = { ...req.body };
    delete userObj.password

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        userObj,
        { new: true }
    );
    res
        .status(StatusCodes.OK)
        .json({ msg: "User has been updated successfully" });
};

export { updateUser, getCurrentUser, getApplicationStats };