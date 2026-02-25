import { Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const DEFAULT_INVITE_DAYS = 3;

function toSafeRoom(room: { passwordHash: string | null } & Record<string, unknown>) {
  const { passwordHash, ...rest } = room;
  return { ...rest, hasPassword: Boolean(passwordHash) };
}

export async function getRooms(req: AuthRequest, res: Response) {
  const rooms = await prisma.room.findMany({
    include: { _count: { select: { members: true, messages: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(rooms.map(room => toSafeRoom(room)));
}

export async function createRoom(req: AuthRequest, res: Response) {
  const { name, description, password } = req.body as { name?: string; description?: string; password?: string };
  if (!name) { res.status(400).json({ error: "Room name required" }); return; }
  try {
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const room = await prisma.room.create({
      data: { name, description, ownerId: req.user!.id, passwordHash },
    });
    await prisma.member.create({ data: { userId: req.user!.id, roomId: room.id } });
    res.status(201).json(toSafeRoom(room));
  } catch {
    res.status(400).json({ error: "Room name already exists" });
  }
}

export async function joinRoom(req: AuthRequest, res: Response) {
  const { roomId } = req.params as { roomId: string };
  const { password, inviteToken } = req.body as { password?: string; inviteToken?: string };
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  if (room.passwordHash) {
    let inviteValid = false;
    if (inviteToken) {
      const invite = await prisma.invite.findUnique({ where: { token: inviteToken } });
      inviteValid = Boolean(invite && invite.roomId === roomId && invite.expiresAt > new Date());
    }
    if (!inviteValid) {
      if (!password) { res.status(403).json({ error: "Password required" }); return; }
      const ok = await bcrypt.compare(password, room.passwordHash);
      if (!ok) { res.status(403).json({ error: "Invalid password" }); return; }
    }
  }
  try {
    await prisma.member.create({ data: { userId: req.user!.id, roomId } });
    res.json({ message: "Joined room" });
  } catch {
    res.status(400).json({ error: "Already a member" });
  }
}

export async function createInvite(req: AuthRequest, res: Response) {
  const { roomId } = req.params as { roomId: string };
  const { expiresInDays } = req.body as { expiresInDays?: number };
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  if (room.ownerId !== req.user!.id) { res.status(403).json({ error: "Only the owner can invite" }); return; }

  const parsedDays = Number(expiresInDays ?? DEFAULT_INVITE_DAYS);
  const safeDays = Number.isFinite(parsedDays) ? Math.min(30, Math.max(1, parsedDays)) : DEFAULT_INVITE_DAYS;
  const expiresAt = new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000);
  const token = crypto.randomBytes(20).toString("hex");

  const invite = await prisma.invite.create({
    data: {
      token,
      roomId: room.id,
      createdById: req.user!.id,
      expiresAt,
    },
  });

  res.status(201).json({ token: invite.token, expiresAt: invite.expiresAt, roomId: invite.roomId });
}

export async function joinByInvite(req: AuthRequest, res: Response) {
  const { token } = req.params as { token: string };
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite) { res.status(404).json({ error: "Invite not found" }); return; }
  if (invite.expiresAt <= new Date()) { res.status(410).json({ error: "Invite expired" }); return; }

  const room = await prisma.room.findUnique({
    where: { id: invite.roomId },
    include: { _count: { select: { members: true, messages: true } } },
  });
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  try {
    await prisma.member.create({ data: { userId: req.user!.id, roomId: room.id } });
  } catch {
    // Already a member - continue
  }

  res.json(toSafeRoom(room));
}

export async function deleteRoom(req: AuthRequest, res: Response) {
  const { roomId } = req.params as { roomId: string };
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  if (room.ownerId !== req.user!.id) { res.status(403).json({ error: "Only the owner can delete" }); return; }
  await prisma.room.delete({ where: { id: roomId } });
  res.json({ message: "Room deleted" });
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