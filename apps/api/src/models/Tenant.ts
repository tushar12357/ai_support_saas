import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    plan: { type: String, default: "free" },
  },
  { timestamps: true }
);

export const Tenant = mongoose.model("Tenant", TenantSchema);
