import { Response } from 'express';
import mongoose from 'mongoose';
import Address from '../models/Address';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get All Addresses for Logged-in User
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await Address.find({ user: req.user!._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: addresses.length, data: addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving addresses' });
  }
};

// 2. Add New Address
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, mobile, street, city, state, pincode, latitude, longitude, googleMapsUrl, isDefault } = req.body;

    if (!fullName?.trim() || !mobile?.trim() || !street?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
      return res.status(400).json({ success: false, message: 'All address fields are required' });
    }

    if (mobile.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }

    // If this is the user's first address, make it default automatically
    const existingCount = await Address.countDocuments({ user: req.user!._id });
    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ user: req.user!._id }, { $set: { isDefault: false } });
    }

    let resolvedMapUrl = googleMapsUrl;
    if (!resolvedMapUrl && latitude && longitude) {
      resolvedMapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    const address = await Address.create({
      user: req.user!._id,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      latitude,
      longitude,
      googleMapsUrl: resolvedMapUrl,
      isDefault: shouldBeDefault,
    });

    res.status(201).json({ success: true, message: 'Address added successfully', data: address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error adding address', error: error.message });
  }
};

// 3. Update Existing Address (Strict ownership verification)
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid address ID' });
    }

    const address = await Address.findOne({ _id: id, user: req.user!._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
    }

    const { fullName, mobile, street, city, state, pincode, latitude, longitude, googleMapsUrl, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user!._id, _id: { $ne: id } }, { $set: { isDefault: false } });
      address.isDefault = true;
    }

    if (fullName !== undefined) address.fullName = fullName.trim();
    if (mobile !== undefined) address.mobile = mobile.trim();
    if (street !== undefined) address.street = street.trim();
    if (city !== undefined) address.city = city.trim();
    if (state !== undefined) address.state = state.trim();
    if (pincode !== undefined) address.pincode = pincode.trim();
    if (latitude !== undefined) address.latitude = latitude;
    if (longitude !== undefined) address.longitude = longitude;
    if (googleMapsUrl !== undefined) address.googleMapsUrl = googleMapsUrl;

    await address.save();

    res.status(200).json({ success: true, message: 'Address updated successfully', data: address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error updating address' });
  }
};

// 4. Delete Address (Strict ownership verification)
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid address ID' });
    }

    const deleted = await Address.findOneAndDelete({ _id: id, user: req.user!._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
    }

    // If default address was deleted, set another address as default if available
    if (deleted.isDefault) {
      const nextAddress = await Address.findOne({ user: req.user!._id }).sort({ createdAt: -1 });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({ success: true, message: 'Address removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error deleting address' });
  }
};

// 5. Set Default Address
export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid address ID' });
    }

    const target = await Address.findOne({ _id: id, user: req.user!._id });
    if (!target) {
      return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
    }

    await Address.updateMany({ user: req.user!._id }, { $set: { isDefault: false } });
    target.isDefault = true;
    await target.save();

    res.status(200).json({ success: true, message: 'Default address updated', data: target });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error setting default address' });
  }
};
