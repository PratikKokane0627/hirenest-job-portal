import express from "express";
import {
  applyForJob,
  getHrApplications,
  getMyApplications,
  updateApplicationStatus
} from "../controllers/application.controller.js";
import { allowRoles, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:jobId", protect, allowRoles("student"), applyForJob);
router.get("/me", protect, allowRoles("student"), getMyApplications);
router.get("/hr", protect, allowRoles("hr", "admin"), getHrApplications);
router.patch("/:id/status", protect, allowRoles("hr", "admin"), updateApplicationStatus);

export default router;
