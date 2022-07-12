const router = require('express').Router();
const { register } = require('../controllers/auth');

const { getAllJobs, createJob, getJob, updateJob, deleteJob } = require('../controllers/jobs');

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router