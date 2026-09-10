"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  CheckCircle2,
  CreditCard,
  Banknote,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useIsMounted } from "@/lib/useIsMounted";

interface SavedAddress {
  _id: string;
  fullName: string;
  mobile: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getTotalAmount, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const mounted = useIsMounted();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);

  // Address Form State
  const [fullName, setFullName] = useState(user?.name || "");
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

  const populateAddressFields = useCallback((addr: SavedAddress) => {
    setFullName(addr.fullName);
    setMobile(addr.mobile);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setLatitude(addr.latitude || null);
    setLongitude(addr.longitude || null);
    setMapsUrl(addr.googleMapsUrl || null);
  }, []);

  // Fetch Saved Addresses
  useEffect(() => {
    if (token) {
      api
        .get("/addresses")
        .then((res) => {
          if (res.data.success && res.data.data.length > 0) {
            const addrs: SavedAddress[] = res.data.data;
            setSavedAddresses(addrs);
            const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
            setSelectedAddressId(defaultAddr._id);
            populateAddressFields(defaultAddr);
          }
        })
        .catch((err) => console.error("Could not fetch addresses", err));
    }
  }, [token, populateAddressFields]);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    if (id === "new") {
      setFullName(user?.name || "");
      setMobile(user?.mobileNumber || "");
      setStreet("");
      setCity("Bengaluru");
      setState("Karnataka");
      setPincode("");
      setLatitude(null);
      setLongitude(null);
      setMapsUrl(null);
    } else {
      const found = savedAddresses.find((a) => a._id === id);
      if (found) populateAddressFields(found);
    }
  };

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

    if (!token) {
      toast.error("Please sign in to complete your order");
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (!fullName.trim() || !mobile.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Please fill in all mandatory delivery details");
      return;
    }

    if (mobile.trim().length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsSubmitting(true);

      // Save address if user checked the box on a new address
      if (selectedAddressId === "new" && saveAddressForFuture) {
        try {
          await api.post("/addresses", {
            fullName: fullName.trim(),
            mobile: mobile.trim(),
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            latitude: latitude || undefined,
            longitude: longitude || undefined,
            googleMapsUrl: mapsUrl || undefined,
            isDefault: savedAddresses.length === 0,
          });
        } catch (err) {
          console.error("Failed to save address to address book", err);
        }
      }

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

      // 1. Create order in backend (server validates prices and atomically decrements stock)
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
          // Sandbox verification
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
    } catch (error: unknown) {
      console.error("Order error", error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || "Failed to complete checkout");
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
        {/* Saved Addresses Selector (if available) */}
        {savedAddresses.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" /> Delivery Address
              </span>
              <button
                type="button"
                onClick={() => router.push("/addresses")}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Manage Addresses
              </button>
            </div>

            <div className="space-y-2">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr._id;
                return (
                  <div
                    key={addr._id}
                    onClick={() => handleSelectAddress(addr._id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-orange-50/30 ring-1 ring-primary/20"
                        : "border-orange-100/70 hover:border-primary/40 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-foreground/70 mt-1 line-clamp-1">
                          {addr.street}, {addr.city} - {addr.pincode}
                        </p>
                        <p className="text-[10px] text-foreground/50 mt-0.5">Mob: +91 {addr.mobile}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                          isSelected ? "border-primary" : "border-foreground/30"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Option to enter a different address */}
              <div
                onClick={() => handleSelectAddress("new")}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedAddressId === "new"
                    ? "border-primary bg-orange-50/30 ring-1 ring-primary/20"
                    : "border-orange-100/70 hover:border-primary/40 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                  <PlusCircle size={15} className="text-primary" />
                  <span>Deliver to a different address</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedAddressId === "new" ? "border-primary" : "border-foreground/30"
                  }`}
                >
                  {selectedAddressId === "new" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Fields (always show if no saved addresses or "new" is selected) */}
        {(savedAddresses.length === 0 || selectedAddressId === "new") && (
          <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-serif font-bold text-sm">
                <MapPin size={18} className="text-primary" />
                <span>{savedAddresses.length > 0 ? "New Address Details" : "Delivery Details"}</span>
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
                <label className="font-bold text-foreground/80 block mb-1">Mobile Number (for delivery) *</label>
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
                  placeholder="e.g. #42, 2nd Cross, Temple Road"
                  className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground/80 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground/80 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full bg-orange-50/20 border border-orange-100/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-medium font-mono"
                  />
                </div>
              </div>

              {token && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={saveAddressForFuture}
                    onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                    className="w-4 h-4 rounded text-primary accent-primary"
                  />
                  <span className="text-xs text-foreground/70 font-medium">
                    Save this address to my account for future orders
                  </span>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Payment Method Card */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100/60 shadow-glass space-y-3">
          <h3 className="font-serif font-bold text-sm text-foreground">Select Payment Method</h3>
          <div className="space-y-2.5">
            <label
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "online"
                  ? "border-primary bg-orange-50/30 ring-1 ring-primary/20"
                  : "border-orange-100/60 hover:border-primary/40 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <span>Pay Online (UPI / Card / Netbanking)</span>
                    <span className="text-[9px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/60">Instant verification & guaranteed temple samagri dispatch</p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "online" ? "border-primary" : "border-foreground/30"
                }`}
              >
                {paymentMethod === "online" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
            </label>

            <label
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === "cod"
                  ? "border-primary bg-orange-50/30 ring-1 ring-primary/20"
                  : "border-orange-100/60 hover:border-primary/40 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-primary">
                  <Banknote size={20} />
                </div>
                <div>
                  <div className="font-bold text-xs text-foreground">Cash on Delivery (COD)</div>
                  <p className="text-[10px] text-foreground/60">Pay cash or UPI at your doorstep upon arrival</p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "cod" ? "border-primary" : "border-foreground/30"
                }`}
              >
                {paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
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
              <span className={`font-medium ${deliveryFee === 0 ? "text-green-600 font-bold" : "text-foreground"}`}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
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
          {isSubmitting
            ? "Confirming Order..."
            : token
            ? `Confirm & Place Order (₹${totalAmount})`
            : `Sign In to Place Order (₹${totalAmount})`}
        </button>
      </form>
    </main>
  );
}
