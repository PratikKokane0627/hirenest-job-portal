import express from "express";
import { getMessages, markMessageRead, sendMessage } from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMessages);
router.post("/", sendMessage);
router.patch("/:id/read", markMessageRead);

export default router;
