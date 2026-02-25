import { Router } from "express";
import {
	getRooms,
	createRoom,
	joinRoom,
	getRoomMessages,
	createInvite,
	joinByInvite,
	deleteRoom,
} from "../controllers/rooms.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
router.get("/", authenticate, getRooms);
router.post("/", authenticate, createRoom);
router.post("/:roomId/join", authenticate, joinRoom);
router.post("/:roomId/invites", authenticate, createInvite);
router.post("/invites/:token/join", authenticate, joinByInvite);
router.delete("/:roomId", authenticate, deleteRoom);
router.get("/:roomId/messages", authenticate, getRoomMessages);
export default router;