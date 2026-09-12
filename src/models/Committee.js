import mongoose from "mongoose";

const PersonSnapshotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collegeID: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const committeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    committeeHeads: {
      type: [PersonSnapshotSchema],
      required: true,
      validate: {
        validator: (heads) => Array.isArray(heads) && heads.length > 0,
        message: "At least one committee head is required",
      },
    },
    coordinators: {
      type: [PersonSnapshotSchema],
      default: [],
    },
    coCoordinators: {
      type: [PersonSnapshotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

committeeSchema.index({ "committeeHeads.email": 1 });
committeeSchema.index({ "committeeHeads.collegeID": 1 });

export default mongoose.models.Committee || mongoose.model("Committee", committeeSchema);
