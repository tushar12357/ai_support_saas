import { Router } from "express";
import { startCall } from "../services/call.service.js";

const router = Router();

/**
 * POST /calls/start
 * (auth middleware assumed)
 */
router.post("/start", (req, res) => {
  const tenantId = "tenant_123"; // from auth middleware
const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const data = startCall(tenantId, userId);
  res.json(data);
});

export default router;
