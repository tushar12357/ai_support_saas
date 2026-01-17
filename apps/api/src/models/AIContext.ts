import mongoose from "mongoose";

const AIContextSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    callId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Call",
      required: true,
    },
    intent: String,
    sentiment: String,
    escalationLevel: { type: Number, default: 0 },
    conversationSummary: [String],
  },
  { timestamps: true }
);

export const AIContext = mongoose.model("AIContext", AIContextSchema);
