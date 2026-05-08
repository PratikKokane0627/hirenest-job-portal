import express from "express";
import {
  bookmarkJob,
  createJob,
  getJobs,
  getMyJobs,
  getSavedJobs,
  removeBookmark,
  updateJob
} from "../controllers/job.controller.js";
import { allowRoles, protect, requireApprovedHr } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/saved", protect, allowRoles("student"), getSavedJobs);
router.post("/", protect, allowRoles("hr", "admin"), requireApprovedHr, createJob);
router.get("/mine", protect, allowRoles("hr", "admin"), getMyJobs);
router.patch("/:id", protect, allowRoles("hr", "admin"), requireApprovedHr, updateJob);
router.post("/:id/bookmark", protect, allowRoles("student"), bookmarkJob);
router.delete("/:id/bookmark", protect, allowRoles("student"), removeBookmark);

export default router;
