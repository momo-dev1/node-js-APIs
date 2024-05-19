import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Job from "../models/Job.js";
import moment from "moment";

/*
    @desc    Get   list of all jobs
    @route   GET   /api/v2/jobs
    @access  Public
*/
const getAllJobs = async (req, res) => {
  const { userId } = req.user;
  const { status, position, sort, search, type } = req.query;

  const queryObj = {
    createdBy: userId,
  };
  
  if (search) {
    queryObj.company = { $regex: search, $options: "i" };
  }

  if (position && position !== "all") {
    queryObj.position = position;
  }

  if (status && status !== "all") {
    queryObj.jobStatus = status;
  }

  if (type && type !== "all") {
    queryObj.jobType = type;
  }

  let result = Job.find(queryObj);

  switch (sort) {
    case "latest":
      result = result.sort("-createdAt");
      break;
    case "oldest":
      result = result.sort("createdAt");
      break;
    case "a-z":
      result = result.sort("company");
      break;
    case "z-a":
      result = result.sort("-company");
      break;
    default:
      result = result.sort("-createdAt");;
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const jobCounts = await Job.countDocuments(queryObj);
  const numOfPages = Math.ceil(jobCounts / limit);

  res
    .status(StatusCodes.OK)
    .json({ jobs, jobCounts, numOfPages, currentPage: page });
};

/*
    @desc    Get   specific job by id
    @route   GET   /api/v2/jobs/:id
    @access  Public
*/
const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  res.status(StatusCodes.OK).json({ job });
};

/*
    @desc    Create   job
    @route   Post     /api/v2/jobs
    @access  Private
*/
const createJob = async (req, res) => {
  const { userId } = req.user;
  const avatarColor = `#${Math.random().toString(16).substr(-6)}`;
  const jobData = {
    ...req.body,
    createdBy: userId,
    avatarColor,
  };

  const job = await Job.create(jobData);

  res.status(StatusCodes.CREATED).json({ job });
};

/*  @desc    Update   specific job by id
    @route   PATCH      /api/v2/jobs/:id
    @access  Private
*/
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ job });
};

/*
    @desc    Delete    specific job by id
    @route   DELETE    /api/v2/jobs/:id
    @access  Private
*/
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  res.status(StatusCodes.OK).json({ msg: "Job has successfully deleted" });
};

/*
    @desc    Get    all job stats for user 
    @route   GET    /api/v2/jobs/stats
    @access  Private
*/
const getStats = async (req, res) => {
  const { userId } = req.user;
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  
  // return status as an object
  stats = stats.reduce((currentStat, stat) => {
    const { _id: name, count } = stat;
    currentStat[name] = count;
    return currentStat;
  }, {});

  const defaultStats = {
    applied: stats.applied || 0,
    interview: stats.interview || 0,
    pending: stats.pending || 0,
    hired: stats.hired || 0,
    rejected: stats.rejected || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);
  monthlyApplications = monthlyApplications
    .map((data) => {
      const {
        _id: { year, month },
        count,
      } = data;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  const totalStats = Object.values(defaultStats).reduce((currentStat, stat) => {
    return currentStat + stat;
  }, 0);

  if (!stats) throw new NotFoundError(`No Job stats found`);

  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyApplications, totalStats });
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob, getStats };
