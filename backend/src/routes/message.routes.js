import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

// POST /api/messages/send
router.post("/send", sendMessage);

// GET /api/messages
router.get("/", getMessages);

export default router;