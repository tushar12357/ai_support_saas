import { signCallToken } from "../utils/jwt.js";
import { v4 as uuid } from "uuid";

export function startCall(tenantId: string, userId: string) {
  const callId = uuid();

  const token = signCallToken({
    tenantId,
    userId,
    callId,
    role: "agent",
    permissions: ["publish_audio", "subscribe"],
  });

  return { callId, token };
}
