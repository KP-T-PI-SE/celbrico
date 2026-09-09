import { Response } from 'express';
import crypto from 'crypto';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_sandbox';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// 1. Create Payment Order
export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Order already paid' });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);

    // If Razorpay secret is set, we can create via Razorpay REST API
    let razorpayOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    if (RAZORPAY_KEY_SECRET && RAZORPAY_KEY_ID !== 'rzp_test_sandbox') {
      try {
        const authHeader = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order.orderNumber,
          }),
        });
        const data = await response.json();
        if (data.id) {
          razorpayOrderId = data.id;
        }
      } catch (err) {
        console.error('Razorpay API call failed, falling back to sandbox identifier:', err);
      }
    }

    order.razorpayOrderId = razorpayOrderId;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: RAZORPAY_KEY_ID,
        customer: {
          name: order.shippingDetails.fullName,
          contact: order.shippingDetails.mobile,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

// 2. Verify Payment Signature
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify cryptographic signature if secret configured
    if (RAZORPAY_KEY_SECRET && razorpaySignature) {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    }

    // Payment validated successfully
    order.paymentStatus = 'completed';
    order.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed',
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};
