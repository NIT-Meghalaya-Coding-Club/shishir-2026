import mongoose from "mongoose";

const CommitteeNameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CommitteeName ||
  mongoose.model("CommitteeName", CommitteeNameSchema);
