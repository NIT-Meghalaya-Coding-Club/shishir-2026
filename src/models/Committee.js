import mongoose from "mongoose";

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
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      validate: {
        validator: (heads) => Array.isArray(heads) && heads.length > 0,
        message: "At least one committee head is required",
      },
    },
    coordinators: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    coCoordinators: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

committeeSchema.index({ committeeHeads: 1 });
committeeSchema.index({ coordinators: 1 });
committeeSchema.index({ coCoordinators: 1 });

const cachedCommittee = mongoose.models.Committee;
const cachedHeadsSchema = cachedCommittee?.schema.path("committeeHeads")?.caster?.schema;

// Drop a development-process model created from the previous embedded snapshot schema.
if (cachedHeadsSchema?.path("name")) {
  delete mongoose.models.Committee;
}

export default mongoose.models.Committee || mongoose.model("Committee", committeeSchema);
