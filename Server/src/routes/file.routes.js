import express from "express";
import { viewResume } from "../controllers/file.controller.js";

const router = express.Router();

router.get("/resume", viewResume);

export default router;
