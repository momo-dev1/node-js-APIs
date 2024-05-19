import { Router } from "express";
const router = Router();

import {
  updateUser,
  getCurrentUser,
  getApplicationStats,
} from "../controllers/userController.js";

import { validateUpdateUserInput } from "../middleware/validation.js"
import { authorizePermissions, checkForTestUser } from "../middleware/authentication.js"

router.route("/current-user").get(getCurrentUser);
router.route("/admin/app-stats").get([authorizePermissions("admin"), getApplicationStats]);
router.route("/update-user").patch(checkForTestUser, validateUpdateUserInput, updateUser);

export default router;
