import dotenv from "dotenv";
import express from "express";
import calls from "./routes/calls.js";
import media from "./routes/media.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import recording from "./routes/recording.js";
import ai from "./routes/ai.js";
import { connectDB } from "./db/mongoose.js";
import authRoutes from "./auth/auth.routes.js";

// Resolve repo root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});
const app = express();
app.use(cors({
  origin: "*", // dev only
}));
app.use(express.json());
await connectDB();
app.use("/auth", authRoutes);

app.use("/calls", calls);
app.use("/media", media);
app.use("/recording", recording);
app.use("/ai", ai);

app.listen(4000, () => {
  console.log("API running on :4000");
});
