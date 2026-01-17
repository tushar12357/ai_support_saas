import { Router } from "express";
import {
  startRecording,
  stopRecording,
} from "../services/recording.service.js";

const router = Router();

// callId -> egressId
const activeRecordings = new Map<string, string>();

router.post("/start", async (_req, res) => {
  const callId = "call_123"; // later from DB / token

  const info = await startRecording(callId);

  activeRecordings.set(callId, info.egressId);

  res.json(info);
});

router.post("/stop", async (_req, res) => {
  const callId = "call_123";

  const egressId = activeRecordings.get(callId);

  if (!egressId) {
    return res.status(400).json({ error: "No active recording" });
  }

  const info = await stopRecording(egressId);

  activeRecordings.delete(callId);

  res.json(info);
});

export default router;
