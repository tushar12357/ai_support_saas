import jwt from "jsonwebtoken";
import type { CallTokenPayload } from "../../../packages/shared/call.types.js";

export function verifyCallToken(token: string): CallTokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as CallTokenPayload;
}
