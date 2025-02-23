import mongoose from "mongoose";
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema(
  {
    name: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true },
    dob: { type: Date },
    gender: {type: String},
    college: { type: String },
    collegeID: { type: String },
    yearOfStudy: { type: Number },
    dept: { type: String },
    accommodation: { type: Boolean, default: false },
    nonVeg: { type: Boolean, default: false },
    emergencyContact: { type: String, unique: true },
    alternateNumber: { type: String, unique: true },
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    registered: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
