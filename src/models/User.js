import mongoose from "mongoose";
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema(
  {
    name: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true },
    accomdation: { type: Boolean, default: false },
    nonVeg: { type: Boolean, default: false },
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
