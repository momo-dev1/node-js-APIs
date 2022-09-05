const { StatusCodes } = require('http-status-codes');
const { BadRequestError, notFoundError } = require('../errors');
const Job = require("../models/job")

/*
    @desc    Get   list of all jobs
    @route   GET   /api/v1/jobs
    @access  Public
*/
const getAllJobs = async (req, res) => {
    const { userId } = req.user
    const { status, position, sort, search } = req.query

    const queryObj = {
        createdBy: userId
    }

    if (status && status !== "all") {
        queryObj.status = status
    }

    if (position && position !== "all") {
        queryObj.position = position
    }

    if (search) {
        queryObj.company = { $regex: search, $options: "i" }
    }
    let result = Job.find(queryObj)

    switch (sort) {
        case "latest":
            result = result.sort("-createdAt")
            break;
        case "oldest":
            result = result.sort("createdAt")
            break;
        case "a-z":
            result = result.sort("company")
            break;
        case "z-a":
            result = result.sort("-company")
            break;
        default:
            result = result
    }
    const page = +req.query.page || 1
    const limit = +req.query.limit || 5
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const jobs = await result

    const job_Counts = await Job.countDocuments(queryObj)
    const numOfPages = Math.ceil(job_Counts / limit)


    res.status(StatusCodes.OK).json({ jobs, job_Counts, numOfPages })
}

/*
    @desc    Get   specific job by id
    @route   GET   /api/v1/jobs/:id
    @access  Public
*/
const getJob = async (req, res) => {
    const { id: jobId } = req.params
    const { userId } = req.user
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })
    if (!job) throw new notFoundError(`No Job match with this id: ${ jobId }`)
    res.status(StatusCodes.OK).json({ job })
}

/*
    @desc    Create   job
    @route   Post     /api/v1/jobs
    @access  Private
*/
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const avatarColor = `#${ Math.random().toString(16).substr(-6) }`

    const job = await Job.create({ ...req.body, avatarColor })
    res.status(StatusCodes.CREATED).json({ job })
}


/*  @desc    Update   specific job by id
    @route   PATCH      /api/v1/jobs/:id
    @access  Private
*/
const updateJob = async (req, res) => {
    const { id: jobId } = req.params
    const { userId } = req.user
    const { company, position } = req.body
    if (company === "" || position === "") throw new BadRequestError("Company or Position cannot be empty")

    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!job) throw new notFoundError(`No Job match with this id: ${ id }`)
    res.status(StatusCodes.OK).json({ job })
}

/*
    @desc    Delete    specific job by id
    @route   DELETE    /api/v1/jobs/:id
    @access  Private
*/
const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
    const { userId } = req.user
    const job = await Job.findByIdAndDelete({
        _id: jobId, createdBy: userId,
    })
    if (!job) throw new notFoundError(`No Job match with this id: ${ id }`)
    res.status(StatusCodes.OK).json({ msg: "Job has successfully deleted" })
}

module.exports = { getAllJobs, createJob, getJob, updateJob, deleteJob }