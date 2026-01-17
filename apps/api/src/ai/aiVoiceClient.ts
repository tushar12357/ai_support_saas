import fs from "fs";
import wav from "wav";
import {
  Room,
  AudioSource,
  LocalAudioTrack,
  TrackPublishOptions,
  AudioFrame,
  TrackSource,
} from "@livekit/rtc-node";
import { AccessToken } from "livekit-server-sdk";

const LIVEKIT_URL = "http://172.17.0.4:7880";
const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;

export async function speakInRoom(
  roomName: string,
  wavFilePath: string
) {
  // 1️⃣ Create token
  const token = new AccessToken(API_KEY, API_SECRET, {
    identity: "ai-agent",
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: false,
  });

  const jwt = await token.toJwt();

  // 2️⃣ Connect as Node RTC client
  const room = new Room();
  await room.connect(LIVEKIT_URL, jwt);

  if (!room.localParticipant) {
    throw new Error("Local participant not available");
  }

  // 3️⃣ Audio source + track
  const sampleRate = 48000;
  const channels = 1;

  const source = new AudioSource(sampleRate, channels);
  const track = LocalAudioTrack.createAudioTrack("ai-voice", source);

  const publishOptions: TrackPublishOptions = {
    source: TrackSource.MICROPHONE,
  };

  await room.localParticipant.publishTrack(track, publishOptions);

  // 4️⃣ Read WAV and push frames
  const reader = new wav.Reader();

  fs.createReadStream(wavFilePath).pipe(reader);

  reader.on("format", (format) => {
    if (format.audioFormat !== 1) {
      throw new Error("Only PCM WAV supported");
    }

    reader.on("data", (chunk: Buffer) => {
      const samples = new Int16Array(
        chunk.buffer,
        chunk.byteOffset,
        chunk.byteLength / 2
      );

      const frame = new AudioFrame({
        data: samples,
        sampleRate,
        channels,
        samplesPerChannel: samples.length / channels,
      });

      source.captureFrame(frame);
    });
  });

  reader.on("end", async () => {
    await room.disconnect();
  });
}
