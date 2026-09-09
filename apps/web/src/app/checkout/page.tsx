"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Navigation, ShieldCheck, CheckCircle2, CreditCard, Banknote, Sparkles, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getTotalAmount, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Address Form State
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState(user?.mobileNumber || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  useEffect(() => {
    setMounted(true);
    if (user?.mobileNumber && !mobile) {
      setMobile(user.mobileNumber);
    }
  }, [user, mobile]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-foreground/50">
        Preparing checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="text-4xl">🪔</div>
        <h2 className="font-serif text-xl font-bold text-foreground">Your Cart is Empty</h2>
        <p className="text-xs text-foreground/60 max-w-xs">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => router.push("/categories")}
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow-glow"
        >
          Browse Products
        </button>
      </main>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalAmount = getTotalAmount();

  // Geolocation Handler
  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        const url = `https://www.google.com/maps?q=${lat},${lng}`;
        setMapsUrl(url);
        setIsLocating(false);
        toast.success("Location coordinates captured successfully!");
      },
      (error) => {
        setIsLocating(false);
        let msg = "Could not fetch location";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please enter your address manually.";
        }
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !mobile.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Please fill in all mandatory delivery details");
      return;
    }

    if (mobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        shippingDetails: {
          fullName: fullName.trim(),
          mobile: mobile.trim(),
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          latitude: latitude || undefined,
          longitude: longitude || undefined,
          googleMapsUrl: mapsUrl || undefined,
        },
        paymentMethod,
      };

      // 1. Create order in backend
      const orderRes = await api.post("/orders", orderPayload);
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || "Failed to create order");
      }

      const createdOrder = orderRes.data.data;

      // 2. If online payment, execute payment verification
      if (paymentMethod === "online") {
        const payRes = await api.post("/payments/create-order", {
          orderId: createdOrder._id,
        });

        if (payRes.data.success) {
          // Sandbox verification: verify immediately
          await api.post("/payments/verify", {
            orderId: createdOrder._id,
            razorpayOrderId: payRes.data.data.razorpayOrderId,
            razorpayPaymentId: `pay_sim_${Date.now()}`,
            razorpaySignature: "sandbox_verified",
          });
        }
      }

      // 3. Clear cart and navigate to confirmation
      clearCart();
      toast.success("Order Placed Successfully!");
      router.push(`/orders/${createdOrder.orderNumber}/confirmation`);
    } catch (error: any) {
      console.error("Order error", error);
      toast.error(error.response?.data?.message || error.message || "Failed to complete checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md px-4 py-3.5 border-b border-orange-100/40 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="font-serif text-lg font-bold text-foreground">Secure Checkout</h1>
          <p className="text-[10px] text-foreground/60">Complete your festival order</p>
        </div>
        <div className="w-9" />
      </div>

      <form onSubmit={handlePlaceOrder} className="max-w-md mx-auto px-4 mt-4 space-y-5">
        {/* Delivery Address Card */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-serif font-bold text-sm">
              <MapPin size={18} className="text-primary" />
              <span>Delivery Details</span>
            </div>

            {/* Geolocation Button */}
            <button
              type="button"
              onClick={handleCaptureLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-primary text-[11px] font-bold rounded-full transition-colors disabled:opacity-60"
            >
              <Navigation size={13} className={isLocating ? "animate-spin" : ""} />
              <span>{isLocating ? "Locating..." : "Use GPS Pin"}</span>
            </button>
          </div>

          {/* Captured location alert badge */}
          {mapsUrl && (
            <div className="bg-green-50 p-2.5 rounded-2xl border border-green-200 flex items-center justify-between text-xs text-green-800">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={15} className="text-green-600" />
                <span>GPS Location Pin Attached</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-green-700 hover:underline flex items-center gap-0.5"
              >
                Preview <ExternalLink size={11} />
              </a>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-foreground/80 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground/80 block mb-1">Mobile Number (for delivery & WhatsApp) *</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground/80 block mb-1">House / Flat / Street Address *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House no., Building, Street / Landmark"
                className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-foreground/80 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-foreground/80 block mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-foreground/80 block mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560001"
                  className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-3">
          <h3 className="font-serif font-bold text-sm text-foreground">Select Payment Method</h3>
          
          <div className="space-y-2.5">
            <label
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "online"
                  ? "bg-primary/5 border-primary shadow-xs"
                  : "bg-white border-orange-100/80 hover:bg-orange-50/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Instant Online Payment (UPI / Cards)</div>
                  <div className="text-[10px] text-foreground/60">Zero transaction fees, instant confirmation</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary' : 'border-foreground/30'}`}>
                {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
            </label>

            <label
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "cod"
                  ? "bg-primary/5 border-primary shadow-xs"
                  : "bg-white border-orange-100/80 hover:bg-orange-50/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Banknote size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Cash on Delivery (COD)</div>
                  <div className="text-[10px] text-foreground/60">Pay cash or UPI upon delivery</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-foreground/30'}`}>
                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-2.5">
          <h3 className="font-serif font-bold text-sm text-foreground">Payment Summary</h3>
          <div className="space-y-1.5 text-xs divide-y divide-orange-50">
            <div className="flex justify-between pt-1 text-foreground/70">
              <span>Items Total ({items.length} items)</span>
              <span className="font-medium text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between pt-1.5 text-foreground/70">
              <span>Express Delivery Fee</span>
              <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600 font-bold' : 'text-foreground'}`}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold text-foreground">
              <span>Payable Amount</span>
              <span className="text-primary text-base">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Place Order CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-primary to-primary-dark text-white font-semibold rounded-2xl py-4 shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform text-sm disabled:opacity-60"
        >
          {isSubmitting ? "Confirming Order..." : `Confirm & Place Order (₹${totalAmount})`}
        </button>
      </form>
    </main>
  );
}
