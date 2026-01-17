import { EgressClient } from "livekit-server-sdk";

const egress = new EgressClient(
  "http://localhost:7880",
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function startRecording(callId: string) {
  return await egress.startRoomCompositeEgress(
    callId, 
    {
      file: {
        filepath: `/out/call_${callId}.webm`,
      },
    },
    {
      audioOnly: true,
    }
  );
}

export async function stopRecording(egressId: string) {
  return await egress.stopEgress(egressId);
}
