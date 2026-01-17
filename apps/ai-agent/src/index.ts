import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import { connectAgent } from "./livekit.js";
import { playWav } from "./audio.js";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});
await connectAgent("call_123");

/**
 * TEMP CONTROL:
 * type a wav path to play it
 * (later replaced by Redis / API)
 */
const rl = readline.createInterface({
  input: process.stdin,
});

console.log("🎤 AI agent ready. Type WAV path:");

rl.on("line", (line) => {
  playWav(line.trim());
});
