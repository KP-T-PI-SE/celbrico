import { Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get Admin Dashboard Metrics
export const getAdminMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers,
      activeProducts,
      recentOrders,
      revenueResult,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['pending', 'confirmed', 'processing'] } }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalCustomers,
        activeProducts,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving admin metrics' });
  }
};

// 2. Get All Orders with Filter, Search, Pagination
export const getAdminOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, paymentStatus, search, page = '1', limit = '20' } = req.query;

    const filter: any = {};
    if (status && status !== 'all') {
      filter.orderStatus = status;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      const searchRegex = { $regex: search as string, $options: 'i' };
      filter.$or = [
        { orderNumber: searchRegex },
        { 'shippingDetails.fullName': searchRegex },
        { 'shippingDetails.mobile': searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'mobileNumber name email'),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving orders' });
  }
};

// 3. Update Order Status with Controlled State Machine
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, allowOverride } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentStatus = order.orderStatus;

    // Allowed forward transitions
    const allowedTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: [],
    };

    if (!allowOverride && currentStatus !== status) {
      const allowed = allowedTransitions[currentStatus] || [];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from "${currentStatus}" to "${status}". Allowed: ${allowed.length > 0 ? allowed.join(', ') : 'none (terminal state)'}`,
        });
      }
    }

    order.orderStatus = status as any;
    order.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user!._id.toString(),
      note: note || `Status transitioned from ${currentStatus} to ${status} by admin`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error updating order status' });
  }
};

// 4. Get Admin Product Inventory (Including Inactive)
export const getAdminProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search, active } = req.query;
    const filter: any = {};

    if (active !== undefined && active !== 'all') {
      filter.isActive = active === 'true';
    }

    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving products' });
  }
};

// 5. Create Product (Admin)
export const createAdminProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, price, discountPrice, stock, images, description, isActive } = req.body;

    if (!name?.trim() || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, Category, and Price are required' });
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a non-negative number' });
    }

    let numDiscount: number | undefined;
    if (discountPrice !== undefined && discountPrice !== '') {
      numDiscount = parseFloat(discountPrice);
      if (isNaN(numDiscount) || numDiscount < 0) {
        return res.status(400).json({ success: false, message: 'Discount price must be a non-negative number' });
      }
    }

    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock must be a non-negative integer' });
    }

    // Auto slug generation
    let baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await Product.create({
      name: name.trim(),
      slug,
      category,
      price: numPrice,
      discountPrice: numDiscount,
      stock: numStock,
      images: Array.isArray(images) ? images : images ? [images] : [],
      description: description?.trim() || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error creating product', error: error.message });
  }
};

// 6. Update Product (Admin)
export const updateAdminProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, category, price, discountPrice, stock, images, description, isActive } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;

    if (price !== undefined) {
      const p = parseFloat(price);
      if (isNaN(p) || p < 0) return res.status(400).json({ success: false, message: 'Invalid price' });
      product.price = p;
    }

    if (discountPrice !== undefined) {
      if (discountPrice === null || discountPrice === '') {
        product.discountPrice = undefined;
      } else {
        const dp = parseFloat(discountPrice);
        if (isNaN(dp) || dp < 0) return res.status(400).json({ success: false, message: 'Invalid discount price' });
        product.discountPrice = dp;
      }
    }

    if (stock !== undefined) {
      const s = parseInt(stock, 10);
      if (isNaN(s) || s < 0) return res.status(400).json({ success: false, message: 'Invalid stock value' });
      product.stock = s;
    }

    if (images !== undefined) {
      product.images = Array.isArray(images) ? images : [images];
    }

    if (description !== undefined) product.description = description.trim();
    if (isActive !== undefined) product.isActive = Boolean(isActive);

    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
};

// 7. Delete / Archive Product
export const deleteAdminProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    // Check if this product was purchased in any historical orders
    const hasOrders = await Order.exists({ 'items.product': id });

    if (hasOrders) {
      // Archive instead of destroying historical records
      await Product.findByIdAndUpdate(id, { isActive: false });
      return res.status(200).json({
        success: true,
        message: 'Product is referenced in historical customer orders and has been archived (deactivated) to maintain order integrity.',
        archived: true,
      });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Product deleted permanently', archived: false });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
};

// 8. Get Customer Directory
export const getAdminCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await User.find({ role: 'user' })
      .select('-pinHash -refreshToken')
      .sort({ createdAt: -1 });

    // Aggregate orders per customer
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$totalAmount', 0],
            },
          },
        },
      },
    ]);

    const statsMap: Record<string, { orderCount: number; totalSpent: number }> = {};
    for (const stat of orderStats) {
      statsMap[stat._id.toString()] = {
        orderCount: stat.orderCount,
        totalSpent: stat.totalSpent,
      };
    }

    const data = customers.map((c) => ({
      id: c._id,
      mobileNumber: c.mobileNumber,
      name: c.name || '',
      email: c.email || '',
      isVerified: c.isVerified,
      createdAt: c.createdAt,
      orderCount: statsMap[c._id.toString()]?.orderCount || 0,
      totalSpent: statsMap[c._id.toString()]?.totalSpent || 0,
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving customers' });
  }
};
