import WebSocket from "ws";

interface Room {
  participants: Map<string, WebSocket>;
}

const rooms = new Map<string, Room>();

export function joinRoom(callId: string, userId: string, ws: WebSocket) {
  if (!rooms.has(callId)) {
    rooms.set(callId, { participants: new Map() });
  }
  rooms.get(callId)!.participants.set(userId, ws);
}

export function leaveRoom(callId: string, userId: string) {
  rooms.get(callId)?.participants.delete(userId);
}

export function forwardSignal(
  callId: string,
  from: string,
  to: string,
  data: any
) {
  const room = rooms.get(callId);
  const target = room?.participants.get(to);

  target?.send(
    JSON.stringify({
      type: "SIGNAL",
      from,
      data,
    })
  );
}
