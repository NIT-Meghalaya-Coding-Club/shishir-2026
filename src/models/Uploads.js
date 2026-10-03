import mongoose from "mongoose";
const { Schema } = mongoose;

const uploadSchema = new Schema(
  {
    type: { type: String, required: true, trim: true, lowercase: true, index: true },
    referenceId: { type: Schema.Types.ObjectId, required: true, index: true },
    referenceType: {
      type: String,
      required: true,
      enum: ["User", "Event", "SacPost"],
    },
    originalSize: { type: Number, default: 0 },
    isProcessed: { type: Boolean, default: false },
    processedSize: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);

export default Upload;
