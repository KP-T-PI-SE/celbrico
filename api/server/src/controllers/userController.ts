import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get Profile of Logged-in User
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-pinHash -refreshToken');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// 2. Update Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, avatar } = req.body;
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (avatar !== undefined) updateData.avatar = avatar.trim();

    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address format' });
      }
      updateData.email = trimmedEmail;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: updateData },
      { new: true }
    ).select('-pinHash -refreshToken');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        mobileNumber: updatedUser.mobileNumber,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};
