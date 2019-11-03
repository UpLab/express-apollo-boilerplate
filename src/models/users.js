import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

export const globalRoles = {
  ADMIN: 'admin',
  CLIENT: 'client',
  TEAM: 'team',
};

const UserSchema = new mongoose.Schema(
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
        unique: 'A user with the email {VALUE} is already registered',
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

// Beautify unique messages
// ref: https://www.npmjs.com/package/mongoose-beautiful-unique-validation#usage
UserSchema.plugin(beautifyUnique);

// UserSchema.plugin(require('mongoose-beautiful-unique-validation'));

UserSchema.methods.isVerified = function isVerified() {
  return !!this.email.verified;
};

UserSchema.statics.findByEmail = function findUserByEmail(email) {
  return this.findOne({ 'email.address': email });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
