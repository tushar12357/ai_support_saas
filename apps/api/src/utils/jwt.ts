import jwt from "jsonwebtoken";
import type { CallTokenPayload } from "../../../../packages/shared/call.types.js";

export function signCallToken(payload: CallTokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "10m",
  });
}
