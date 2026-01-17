import {
  Room,
  AudioSource,
  LocalAudioTrack,
  TrackSource,
  AudioFrame,
} from "@livekit/rtc-node";
import { AccessToken } from "livekit-server-sdk";

let room: Room;
let audioSource: AudioSource;

export async function connectAgent(roomName: string) {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: "ai-agent" }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
  });

  room = new Room();

  await room.connect(
    "http://localhost:7880",
    await token.toJwt()
  );

  audioSource = new AudioSource(22050, 1);
  const track = LocalAudioTrack.createAudioTrack(
    "ai-voice",
    audioSource
  );

  await room.localParticipant!.publishTrack(track, {
    source: TrackSource.MICROPHONE,
  });

  console.log("✅ AI agent connected to LiveKit");
}

export function pushFrame(frame: AudioFrame) {
  audioSource.captureFrame(frame);
}
