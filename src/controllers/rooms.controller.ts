import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export async function getRooms(req: AuthRequest, res: Response) {
  const rooms = await prisma.room.findMany({
    include: { _count: { select: { members: true, messages: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(rooms);
}

export async function createRoom(req: AuthRequest, res: Response) {
  const { name, description } = req.body;
  if (!name) { res.status(400).json({ error: "Room name required" }); return; }
  try {
    const room = await prisma.room.create({
      data: { name, description },
    });
    await prisma.member.create({ data: { userId: req.user!.id, roomId: room.id } });
    res.status(201).json(room);
  } catch {
    res.status(400).json({ error: "Room name already exists" });
  }
}

export async function joinRoom(req: AuthRequest, res: Response) {
  const { roomId } = req.params as { roomId: string };
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  try {
    await prisma.member.create({ data: { userId: req.user!.id, roomId } });
    res.json({ message: "Joined room" });
  } catch {
    res.status(400).json({ error: "Already a member" });
  }
}

export async function getRoomMessages(req: AuthRequest, res: Response) {
  const { roomId } = req.params as { roomId: string };
  const messages = await prisma.message.findMany({
    where: { roomId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
  res.json(messages);
}