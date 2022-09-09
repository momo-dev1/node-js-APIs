const router = require('express').Router();

const { getAllJobs, createJob, getJob, updateJob, deleteJob, getStats } = require('../controllers/jobs');

router.route("/").get(getAllJobs).post(createJob);
router.route("/stats").get(getStats)
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router