import mongoose from "mongoose";

const sacPostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    post: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.SacPost || mongoose.model("SacPost", sacPostSchema);
