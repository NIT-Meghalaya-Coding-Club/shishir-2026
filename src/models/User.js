const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), unique: true },
    name: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    emailVerified: { type: Date, default: null },
    password: { type: String, default: null },
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;