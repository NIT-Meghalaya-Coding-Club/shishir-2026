import mongoose from "mongoose";

const munPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    order: { type: Number, required: true, default: 0, index: true },
  },
  { timestamps: true }
);

munPostSchema.index({ title: 1 });

export default mongoose.models.MunPost || mongoose.model("MunPost", munPostSchema);
