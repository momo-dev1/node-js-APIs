const Job = require("../models/Job")


/*
    @desc    Get   list of all jobs
    @route   GET   /api/v1/jobs
    @access  Public
*/
const getAllJobs = async (req, res) => {
    const categories = await Category.find({})
    res.status(200).json({ results: getAllCategories.length, data: categories })
}

/*
    @desc    Create   category
    @route   Post     /api/v1/categories
    @access  Private
*/
const createJob = async (req, res) => {
    const { name } = req.body
    const category = await Category.create({ name, slug: slugify(name) })
    res.status(201).json({ data: category })
}

/*
    @desc    Get   specific category by id
    @route   GET   /api/v1/categories/:id
    @access  Public
*/
const getJob = async (req, res) => {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) return res.status(404).json({ msg: "Category not found" })
    res.status(200).json({ data: category })
}

/*  @desc    Update   specific category by id
    @route   PUT      /api/v1/categories/:id
    @access  Private
*/
const updateJob = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const category = await Category.findByIdAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true })
    if (!category) return res.status(404).json({ msg: "Category not found" })
    res.status(200).json({ data: category })
}

/*
    @desc    Delete    specific category by id
    @route   DELETE    /api/v1/categories/:id
    @access  Private
*/
const deleteJob = async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    if (!category) return res.status(404).json({ msg: "Category not found" })
    res.status(204).json({ msg: "Category has successfully deleted" })
}

module.exports = {}