import { Request, Response } from "express";
import { Tenant } from "../models/Tenant.js";
import { User } from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  signJwt,
} from "./auth.service.js";

/**
 * POST /auth/register
 */
export async function register(req: Request, res: Response) {
  const { companyName, email, password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }

  // 1️⃣ Create tenant
  const tenant = await Tenant.create({ name: companyName });

  // 2️⃣ Create admin user
  const passwordHash = await hashPassword(password);

  const user = await User.create({
    tenantId: tenant._id,
    email,
    passwordHash,
    role: "admin",
  });

  // 3️⃣ Issue JWT
  const token = signJwt({
    userId: user._id,
    tenantId: tenant._id,
    role: user.role,
  });

  res.json({ token });
}

/**
 * POST /auth/login
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signJwt({
    userId: user._id,
    tenantId: user.tenantId,
    role: user.role,
  });

  res.json({ token });
}
