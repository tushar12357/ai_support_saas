import mongoose from "mongoose";

const CallSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    roomName: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
  },
  { timestamps: true }
);

export const Call = mongoose.model("Call", CallSchema);
