export type CallRole = "agent" | "customer";

export interface CallTokenPayload {
  tenantId: string;
  userId: string;
  callId: string;
  role: CallRole;
  permissions: string[];
}
