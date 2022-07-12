const Job = require("../models/job")


/*
    @desc    Get   list of all jobs
    @route   GET   /api/v1/jobs
    @access  Public
*/
const getAllJobs = async (req, res) => {
    const categories = await Job.find({})
    res.status(200).json({ results: getAllCategories.length, data: categories })
}

/*
    @desc    Create   job
    @route   Post     /api/v1/jobs
    @access  Private
*/
const createJob = async (req, res) => {
    const { name } = req.body
    const job = await Job.create({ name })
    res.status(201).json({ data: job })
}

/*
    @desc    Get   specific job by id
    @route   GET   /api/v1/jobs/:id
    @access  Public
*/
const getJob = async (req, res) => {
    const { id } = req.params
    const job = await Job.findById(id)
    if (!job) return res.status(404).json({ msg: "Job not found" })
    res.status(200).json({ data: job })
}

/*  @desc    Update   specific job by id
    @route   PUT      /api/v1/jobs/:id
    @access  Private
*/
const updateJob = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const job = await Job.findByIdAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
    if (!job) return res.status(404).json({ msg: "Job not found" })
    res.status(200).json({ data: job })
}

/*
    @desc    Delete    specific job by id
    @route   DELETE    /api/v1/jobs/:id
    @access  Private
*/
const deleteJob = async (req, res) => {
    const { id } = req.params
    const job = await Job.findByIdAndDelete(id)
    if (!job) return res.status(404).json({ msg: "Category not found" })
    res.status(204).json({ msg: "Job has successfully deleted" })
}

module.exports = { getAllJobs, createJob, getJob, updateJob, deleteJob }