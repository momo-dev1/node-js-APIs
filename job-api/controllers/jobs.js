const { StatusCodes } = require('http-status-codes');
const { BadRequestError, notFoundError } = require('../errors');
const Job = require("../models/job")


/*
    @desc    Get   list of all jobs
    @route   GET   /api/v1/jobs
    @access  Public
*/
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({})
    res.status(StatusCodes.OK).json({ jobs, counts: jobs.length })
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

/*
    @desc    Get   specific job by id
    @route   GET   /api/v1/jobs/:id
    @access  Public
*/
const getJob = async (req, res) => {
    const { id } = req.params
    const job = await Job.findById({ _id: id })
    if (!job) return BadRequestError(`No Job match with this ${ id }`)
    res.status(StatusCodes.OK).json({ job })
}

/*  @desc    Update   specific job by id
    @route   PUT      /api/v1/jobs/:id
    @access  Private
*/
const updateJob = async (req, res) => {
    const { id } = req.params
    const { company, position } = req.body
    const job = await Job.findByIdAndUpdate(
        { _id: id },
        { company, position },
        { new: true, runValidators: true }
    )
    if (!job) return BadRequestError(`No Job match with this ${ id }`)
    res.status(StatusCodes.OK).json({ job })
}

/*
    @desc    Delete    specific job by id
    @route   DELETE    /api/v1/jobs/:id
    @access  Private
*/
const deleteJob = async (req, res) => {
    const { id } = req.params
    const job = await Job.findByIdAndDelete(id)
    if (!job) return BadRequestError(`No Job match with this ${ id }`)
    res.status(StatusCodes.OK).json({ msg: "Job has successfully deleted" })
}

module.exports = { getAllJobs, createJob, getJob, updateJob, deleteJob }