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
    const jobs = await Job.find({ createdBy: userId }).sort("createdAt")
    res.status(StatusCodes.OK).json({ jobs, job_Counts: jobs.length })
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

    const job = await Job.create(req.body)
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