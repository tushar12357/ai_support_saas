import express from "express";
import { speakInRoom } from "../ai/aiVoiceClient.js";

const router = express.Router();

router.post("/speak", async (req, res) => {
  const { roomName, wavPath } = req.body;

  await speakInRoom(roomName, wavPath);

  res.json({ status: "AI speaking" });
});

export default router;
