import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  subtotal: number;
}

export interface IShippingDetails {
  fullName: string;
  mobile: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}

export interface IOrderStatusHistory {
  status: string;
  changedAt: Date;
  changedBy?: string;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingDetails: IShippingDetails;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: IOrderStatusHistory[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  whatsappSent?: boolean;
  whatsappStatus: 'not_attempted' | 'attempted' | 'dispatched' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  subtotal: { type: Number, required: true, min: 0 },
});

const ShippingDetailsSchema: Schema = new Schema({
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  latitude: { type: Number },
  longitude: { type: Number },
  googleMapsUrl: { type: String },
});

const OrderStatusHistorySchema: Schema = new Schema({
  status: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: String },
  note: { type: String },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    shippingDetails: { type: ShippingDetailsSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['online', 'cod'],
      default: 'online',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
      index: true,
    },
    statusHistory: [OrderStatusHistorySchema],
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    whatsappSent: { type: Boolean, default: false },
    whatsappStatus: {
      type: String,
      enum: ['not_attempted', 'attempted', 'dispatched', 'failed'],
      default: 'not_attempted',
    },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
