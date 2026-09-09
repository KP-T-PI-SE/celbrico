import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import OTP from '../models/OTP';
import { generateToken, generateRefreshToken } from '../utils/jwt';

// 1. Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) return res.status(400).json({ message: 'Mobile number is required' });

    // Generate a 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // In a real scenario, integrate Twilio WhatsApp/SMS here.
    // For now, we mock the sending process by logging it:
    console.log(`[MOCK SMS] OTP for ${mobileNumber} is ${generatedOtp}`);

    // Save/Update OTP in DB
    await OTP.findOneAndUpdate(
      { mobileNumber },
      { otp: generatedOtp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, otp } = req.body;

    const otpRecord = await OTP.findOne({ mobileNumber, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP is valid. Find or create user
    let user = await User.findOne({ mobileNumber });
    if (!user) {
      user = await User.create({ mobileNumber, isVerified: true });
    } else {
      user.isVerified = true;
      await user.save();
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate Temporary Token (for setting PIN)
    const tempToken = generateToken(user._id.toString());

    res.status(200).json({ 
      success: true, 
      message: 'OTP verified successfully',
      tempToken,
      hasPin: !!user.pinHash 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Set PIN (Protected by auth middleware)
export const setPin = async (req: any, res: Response) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length < 4 || pin.length > 6) {
      return res.status(400).json({ success: false, message: 'PIN must be 4 to 6 digits' });
    }

    // User is guaranteed from protect middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized session' });
    }

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);

    const user = await User.findByIdAndUpdate(
      userId,
      { pinHash },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'PIN set successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4. Login with PIN
export const loginPin = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, pin } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user || !user.pinHash) {
      return res.status(400).json({ success: false, message: 'Invalid credentials or PIN not set' });
    }

    const isMatch = await bcrypt.compare(pin, user.pinHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid PIN' });
    }

    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
