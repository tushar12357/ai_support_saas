import "dotenv/config";

import { WebSocketServer } from "ws";
import { verifyCallToken } from "./auth.js";
import { joinRoom, leaveRoom, forwardSignal } from "./room.manager.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: any) => {
  ws.on("message", (raw: string) => {
    const msg = JSON.parse(raw);

    if (msg.type === "JOIN_CALL") {
      const payload = verifyCallToken(msg.token);

      ws.userId = payload.userId;
      ws.callId = payload.callId;

      joinRoom(payload.callId, payload.userId, ws);

      ws.send(
        JSON.stringify({
          type: "JOINED",
          callId: payload.callId,
        })
      );
    }

    if (msg.type === "SIGNAL") {
      forwardSignal(
        ws.callId,
        ws.userId,
        msg.payload.to,
        msg.payload.data
      );
    }
  });

  ws.on("close", () => {
    leaveRoom(ws.callId, ws.userId);
  });
});

console.log("Signaling server running on :8080");
