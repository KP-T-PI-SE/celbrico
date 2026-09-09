import { Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Create New Order (Server-side price and stock validation)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingDetails, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.mobile || !shippingDetails.street || !shippingDetails.city || !shippingDetails.pincode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // Fetch and validate each product from DB
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ success: false, message: `Invalid product ID: ${item.productId}` });
      }

      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product not available: ${item.productId}` });
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${quantity}`,
        });
      }

      // Server-side pricing: prefer discountPrice if valid, otherwise regular price
      const unitPrice = (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price;
      subtotal += unitPrice * quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity,
        price: unitPrice,
      });
    }

    // Delivery fee: Free delivery above ₹499, otherwise ₹49
    const deliveryFee = subtotal >= 499 ? 0 : 49;
    const totalAmount = subtotal + deliveryFee;

    // Generate Google Maps URL if coordinates provided
    let googleMapsUrl = shippingDetails.googleMapsUrl;
    if (!googleMapsUrl && shippingDetails.latitude && shippingDetails.longitude) {
      googleMapsUrl = `https://www.google.com/maps?q=${shippingDetails.latitude},${shippingDetails.longitude}`;
    }

    // Generate unique order number (e.g., CEL-M3K9X-841)
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `CEL-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      user: req.user!._id,
      items: validatedItems,
      shippingDetails: {
        ...shippingDetails,
        googleMapsUrl,
      },
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'online',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'processing',
    });

    // Decrement stock for purchased items
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error creating order', error: error.message });
  }
};

// 2. Get Logged-in User's Orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving orders' });
  }
};

// 3. Get Single Order by ID or Order Number
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let order;

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user owns this order or is admin
    if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving order' });
  }
};
