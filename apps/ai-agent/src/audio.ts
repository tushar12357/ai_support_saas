import fs from "fs";
import wav from "wav";
import { AudioFrame } from "@livekit/rtc-node";
import { pushFrame } from "./livekit.js";

export function playWav(filePath: string) {
  const reader = new wav.Reader();
  fs.createReadStream(filePath).pipe(reader);

  reader.on("format", (format) => {
    console.log("WAV format:", format);

    reader.on("data", (chunk: Buffer) => {
      const samples = new Int16Array(
        chunk.buffer,
        chunk.byteOffset,
        chunk.byteLength / 2
      );

      const frame = new AudioFrame({
        data: samples,
        sampleRate: format.sampleRate,          // 🔥 22050
        channels: format.channels,              // 1
        samplesPerChannel: samples.length / format.channels,
      });

      pushFrame(frame);
    });
  });
}
