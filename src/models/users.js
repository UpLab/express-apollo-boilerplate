import mongoose from 'mongoose';

export const globalRoles = {
  ADMIN: 'admin',
  CLIENT: 'client',
  TEAM: 'team',
};

const User = new mongoose.Schema(
  {
    services: {
      password: {
        salt: String,
        hash: String,
      },
    },
    email: {
      address: {
        type: String,
        lowercase: true,
        unique: true,
        index: true,
        required: [true, 'Please enter an email'],
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    profile: {
      avatar: String,
      name: {
        type: String,
        required: [true, 'Please enter a full name'],
        index: true,
      },
      company: String,
    },
    role: {
      type: String,
      default: globalRoles.CLIENT,
    },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
export default mongoose.model('User', User);
