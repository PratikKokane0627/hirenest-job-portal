import express from "express";
import adminRoutes from "./admin.routes.js";
import applicationRoutes from "./application.routes.js";
import authRoutes from "./auth.routes.js";
import fileRoutes from "./file.routes.js";
import jobRoutes from "./job.routes.js";
import messageRoutes from "./message.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "HireNest" });
});

router.use("/auth", authRoutes);
router.use("/files", fileRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/admin", adminRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);

export default router;
