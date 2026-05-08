import express from "express";
import {
  deleteJob,
  deleteUser,
  getAnalytics,
  getApplicationsForModeration,
  getJobsForModeration,
  getUsers,
  updateJobStatus,
  updateUserApproval
} from "../controllers/admin.controller.js";
import { allowRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/users", getUsers);
router.get("/jobs", getJobsForModeration);
router.get("/applications", getApplicationsForModeration);
router.patch("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);
router.patch("/users/:id/approval", updateUserApproval);
router.delete("/users/:id", deleteUser);
router.get("/analytics", getAnalytics);

export default router;
