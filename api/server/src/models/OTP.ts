import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  mobileNumber: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // OTP expires in 5 minutes (300 seconds)
    },
  }
);

export default mongoose.model<IOTP>('OTP', OTPSchema);
