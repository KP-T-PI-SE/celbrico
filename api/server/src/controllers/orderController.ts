import { Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Create New Order (Atomic Stock Decrement, Server-side Pricing, Snapshot History)
export const createOrder = async (req: AuthRequest, res: Response) => {
  // Array to track atomically reserved stock for rollback if subsequent items fail
  const reservedStock: Array<{ productId: mongoose.Types.ObjectId; quantity: number }> = [];

  try {
    const { items, shippingDetails, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (
      !shippingDetails ||
      !shippingDetails.fullName?.trim() ||
      !shippingDetails.mobile?.trim() ||
      !shippingDetails.street?.trim() ||
      !shippingDetails.city?.trim() ||
      !shippingDetails.pincode?.trim()
    ) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    const validatedItems = [];
    let subtotal = 0;

    // Process each item with atomic concurrency protection
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        await rollbackReservedStock(reservedStock);
        return res.status(400).json({ success: false, message: `Invalid product ID: ${item.productId}` });
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      // Atomic conditional update to decrement stock preventing race condition overselling
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          isActive: true,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        { new: true }
      );

      if (!product) {
        // Find product to provide specific error message
        const currentProduct = await Product.findById(item.productId);
        await rollbackReservedStock(reservedStock);

        if (!currentProduct || !currentProduct.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product is no longer available in the active catalog`,
          });
        }

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${currentProduct.name}". Only ${currentProduct.stock} unit(s) remaining.`,
        });
      }

      // Record successful atomic reservation for rollback in case subsequent item fails
      reservedStock.push({ productId: product._id as mongoose.Types.ObjectId, quantity });

      // Calculate server-side authoritative price snapshot
      const unitPrice =
        product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      const itemSubtotal = unitPrice * quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity,
        price: unitPrice,
        originalPrice: product.price,
        subtotal: itemSubtotal,
      });
    }

    // Authoritative server-side delivery fee: Free delivery above ₹499, otherwise ₹49
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
        fullName: shippingDetails.fullName.trim(),
        mobile: shippingDetails.mobile.trim(),
        street: shippingDetails.street.trim(),
        city: shippingDetails.city.trim(),
        state: (shippingDetails.state || 'Karnataka').trim(),
        pincode: shippingDetails.pincode.trim(),
        googleMapsUrl,
      },
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'online',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      statusHistory: [
        {
          status: 'processing',
          changedAt: new Date(),
          changedBy: req.user!._id.toString(),
          note: 'Order successfully created and payment pending/processing',
        },
      ],
      whatsappStatus: 'not_attempted',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error: any) {
    await rollbackReservedStock(reservedStock);
    res.status(500).json({ success: false, message: 'Server error creating order', error: error.message });
  }
};

// Helper: Rollback reserved stock in case of order failure
async function rollbackReservedStock(reservations: Array<{ productId: mongoose.Types.ObjectId; quantity: number }>) {
  for (const res of reservations) {
    try {
      await Product.findByIdAndUpdate(res.productId, {
        $inc: { stock: res.quantity },
      });
    } catch (err) {
      console.error(`Failed to rollback stock for product ${res.productId}:`, err);
    }
  }
}

// 2. Get Logged-in User's Orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving orders' });
  }
};

// 3. Get Single Order by ID or Order Number (Enforcing User Ownership or Admin)
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

// 4. Update WhatsApp Dispatch Status
export const updateWhatsAppStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['not_attempted', 'attempted', 'dispatched', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid WhatsApp status value' });
    }

    let order = await Order.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        { orderNumber: id },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user owns order or is admin
    if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    order.whatsappStatus = status as any;
    order.whatsappSent = status === 'dispatched';
    await order.save();

    res.status(200).json({ success: true, message: 'WhatsApp status updated', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error updating WhatsApp status' });
  }
};
