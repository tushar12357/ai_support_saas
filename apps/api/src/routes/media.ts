import { Router } from "express";
import { createLiveKitToken } from "../services/livekit.service.js";

const router = Router();

router.post("/token", async (_req, res) => {
  const callId = "call_123";
const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const jwt = await createLiveKitToken(callId, userId); // ✅ await

  console.log("JWT TYPE:", typeof jwt);
  console.log("JWT VALUE:", jwt);

  res.json({ token: jwt });
});

export default router;
