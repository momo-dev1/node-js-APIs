import { Router } from "express";
const router = Router();

import {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  getStats,
} from "../controllers/jobController.js";

import { validateJobInput, validateIdParam } from "../middleware/validation.js"
import { checkForTestUser } from "../middleware/authentication.js";

router.route("/").get(getAllJobs).post(checkForTestUser,validateJobInput, createJob);
router.route("/stats").get(getStats);
router.route("/:id").get(validateIdParam, getJob).patch(checkForTestUser,validateJobInput, validateIdParam, updateJob).delete(checkForTestUser,validateIdParam, deleteJob);

export default router;
