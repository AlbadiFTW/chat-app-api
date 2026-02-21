import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) { res.status(400).json({ error: "Email already registered" }); return; }
    const hashed = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hashed },
    });
    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.issues }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = registerSchema.omit({ name: true }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ error: "Invalid credentials" }); return;
    }
    const token = signToken({ id: user.id, email: user.email, name: user.name });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.issues }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
}