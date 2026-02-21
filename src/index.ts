import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { verifyToken } from "./lib/jwt";
import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/rooms.routes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

app.get("/health", (_: Request, res: Response) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Track online users
const onlineUsers = new Map<string, { name: string; socketId: string }>();

io.use((socket: Socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));
  try {
    const user = verifyToken(token);
    (socket as any).user = user;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket: Socket) => {
  const user = (socket as any).user;
  console.log(`${user.name} connected`);

  // Mark user online
  onlineUsers.set(user.id, { name: user.name, socketId: socket.id });
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // Join a room
  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit("user_joined", { userId: user.id, name: user.name });
  });

  // Send a message
  socket.on("send_message", async ({ roomId, content }: { roomId: string; content: string }) => {
    if (!content?.trim()) return;
    const message = await prisma.message.create({
      data: { content, userId: user.id, roomId },
      include: { user: { select: { id: true, name: true } } },
    });
    io.to(roomId).emit("new_message", message);
  });

  // Typing indicator
  socket.on("typing", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user_typing", { userId: user.id, name: user.name });
  });

  socket.on("stop_typing", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user_stop_typing", { userId: user.id });
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers.delete(user.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log(`${user.name} disconnected`);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));