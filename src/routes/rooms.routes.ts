import { Router } from "express";
import { getRooms, createRoom, joinRoom, getRoomMessages } from "../controllers/rooms.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
router.get("/", authenticate, getRooms);
router.post("/", authenticate, createRoom);
router.post("/:roomId/join", authenticate, joinRoom);
router.get("/:roomId/messages", authenticate, getRoomMessages);
export default router;