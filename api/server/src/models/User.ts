import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  mobileNumber: string;
  name?: string;
  email?: string;
  avatar?: string;
  pinHash?: string;
  isVerified: boolean;
  refreshToken?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    pinHash: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
