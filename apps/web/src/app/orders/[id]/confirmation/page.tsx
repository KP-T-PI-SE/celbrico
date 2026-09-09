"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, MapPin, ExternalLink } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "@/lib/api";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingDetails: {
    fullName: string;
    mobile: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    googleMapsUrl?: string;
  };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Business WhatsApp number (can be configured via env)
  const businessWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${resolvedParams.id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching order confirmation", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl animate-bounce mb-3">🪔</div>
        <p className="text-xs text-foreground/60">Confirming your festival order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="font-serif text-xl font-bold text-foreground">Order Record Not Found</h2>
        <p className="text-xs text-foreground/60 max-w-xs">
          We could not locate this order. Please verify your order number or check your order history.
        </p>
        <Link
          href="/orders"
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow-glow"
        >
          View My Orders
        </Link>
      </main>
    );
  }

  // Generate WhatsApp Order Message
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.name} (₹${item.price * item.quantity})`)
    .join("\n");

  const addressText = `${order.shippingDetails.street}, ${order.shippingDetails.city}, ${order.shippingDetails.pincode}`;
  const locationText = order.shippingDetails.googleMapsUrl
    ? `\n📍 Map Pin: ${order.shippingDetails.googleMapsUrl}`
    : "";

  const whatsappMessage = `🪔 *NEW CELEBRICO ORDER*\n` +
    `*Order No:* ${order.orderNumber}\n` +
    `*Customer:* ${order.shippingDetails.fullName} (+91 ${order.shippingDetails.mobile})\n` +
    `*Address:* ${addressText}${locationText}\n\n` +
    `*Items:*\n${itemsText}\n\n` +
    `*Total:* ₹${order.totalAmount} (${order.paymentMethod.toUpperCase()} - ${order.paymentStatus.toUpperCase()})\n\n` +
    `Please confirm dispatch for the auspicious occasion! 🙏`;

  const whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-background pb-16 pt-8 px-4">
      <div className="max-w-md mx-auto space-y-5">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100/60 shadow-glass text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full">
            Order Confirmed
          </span>

          <h1 className="font-serif text-2xl font-bold text-foreground mt-2 mb-1">
            Har Tyohar Ki Shubhkamnaye!
          </h1>
          <p className="text-xs text-foreground/60">
            Thank you for ordering with Celbrico. Your order is being packed with devotion and care.
          </p>

          <div className="mt-4 p-3 bg-orange-50/50 rounded-2xl border border-orange-100/60 flex items-center justify-between text-xs">
            <span className="text-foreground/60 font-medium">Order Number</span>
            <span className="font-mono font-bold text-primary text-sm">{order.orderNumber}</span>
          </div>
        </div>

        {/* WhatsApp Dispatch Callout Card */}
        <div className="bg-linear-to-r from-green-600 to-emerald-700 rounded-3xl p-5 text-white shadow-glow space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl shrink-0">
              <FaWhatsapp size={28} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Send Order to WhatsApp</h3>
              <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                Dispatch your order details & GPS pin directly to our fulfillment team for instant tracking!
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-green-700 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-50 transition-colors shadow-sm"
          >
            <FaWhatsapp size={18} /> Open WhatsApp with Order Details
          </a>
        </div>

        {/* Order Details List */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-3">
          <h3 className="font-serif font-bold text-sm text-foreground">Items Ordered ({order.items.length})</h3>
          
          <div className="divide-y divide-orange-50 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-foreground">{item.name}</div>
                  <div className="text-[10px] text-foreground/50">Qty: {item.quantity} × ₹{item.price}</div>
                </div>
                <div className="font-bold text-foreground">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-orange-100/60 space-y-1.5 text-xs">
            <div className="flex justify-between text-foreground/70">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-bold">
                {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-orange-50">
              <span>Total Paid</span>
              <span className="text-primary text-base">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-2 text-xs">
          <div className="flex items-center gap-2 font-serif font-bold text-sm text-foreground">
            <MapPin size={16} className="text-primary" /> Delivery Destination
          </div>
          <div className="font-bold text-foreground/90">{order.shippingDetails.fullName} (+91 {order.shippingDetails.mobile})</div>
          <div className="text-foreground/70">{addressText}</div>
          {order.shippingDetails.googleMapsUrl && (
            <a
              href={order.shippingDetails.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline pt-1"
            >
              View GPS Delivery Pin on Google Maps <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3">
          <Link
            href="/orders"
            className="flex-1 py-3.5 bg-white border border-orange-200 text-foreground/80 font-bold text-xs rounded-2xl text-center hover:bg-orange-50 transition-colors"
          >
            My Orders
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 bg-primary text-white font-bold text-xs rounded-2xl text-center shadow-glow hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
