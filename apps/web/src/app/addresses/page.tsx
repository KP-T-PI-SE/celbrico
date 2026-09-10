"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Plus, Trash2, CheckCircle2, Navigation } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useIsMounted } from "@/lib/useIsMounted";

export interface AddressItem {
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

export default function AddressesPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const mounted = useIsMounted();

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);

  const loadAddresses = () => {
    api
      .get("/addresses")
      .then((res) => {
        if (res.data.success) {
          setAddresses(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load addresses", err));
  };

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/addresses");
      return;
    }

    let isSubscribed = true;
    api
      .get("/addresses")
      .then((res) => {
        if (isSubscribed && res.data.success) {
          setAddresses(res.data.data);
        }
      })
      .catch((err) => {
        if (isSubscribed) console.error("Failed to load addresses", err);
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [token, router]);

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setMapsUrl(`https://www.google.com/maps?q=${lat},${lng}`);
        setIsLocating(false);
        toast.success("Coordinates captured successfully!");
      },
      () => {
        setIsLocating(false);
        toast.error("Could not capture GPS location. Please enter manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Please fill in all mandatory fields");
      return;
    }

    if (mobile.trim().length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.post("/addresses", {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        googleMapsUrl: mapsUrl || undefined,
      });

      if (res.data.success) {
        toast.success("Address added successfully!");
        setShowAddModal(false);
        resetForm();
        loadAddresses();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await api.delete(`/addresses/${id}`);
      if (res.data.success) {
        toast.success("Address removed");
        setAddresses((prev) => prev.filter((a) => a._id !== id));
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await api.patch(`/addresses/${id}/default`);
      if (res.data.success) {
        toast.success("Default address updated");
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a._id === id }))
        );
      }
    } catch {
      toast.error("Failed to set default address");
    }
  };

  const resetForm = () => {
    setFullName("");
    setMobile("");
    setStreet("");
    setCity("Bengaluru");
    setState("Karnataka");
    setPincode("");
    setIsDefault(false);
    setLatitude(null);
    setLongitude(null);
    setMapsUrl(null);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-sm text-foreground/50">Loading addresses...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md px-4 py-3.5 border-b border-orange-100/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Saved Addresses</h1>
            <p className="text-[10px] text-foreground/60">Manage your festival delivery locations</p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-3.5 py-1.5 bg-linear-to-r from-primary to-primary-light text-white font-bold text-xs rounded-full shadow-glow flex items-center gap-1 hover:scale-105 transition-transform"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-white/70 rounded-3xl animate-pulse border border-orange-100/50" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
              📍
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">No Saved Addresses</h2>
              <p className="text-xs text-foreground/60 max-w-xs mx-auto mt-1">
                Add your home or mandir address for fast 1-click festival deliveries.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-primary-light text-white font-medium text-xs rounded-full shadow-glow"
            >
              <Plus size={15} /> Add Delivery Address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white rounded-3xl p-5 border shadow-glass space-y-3 transition-all ${
                addr.isDefault ? "border-primary/50 shadow-md ring-1 ring-primary/20" : "border-orange-100/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="font-bold text-sm text-foreground">{addr.fullName}</span>
                </div>
                {addr.isDefault && (
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                    Default
                  </span>
                )}
              </div>

              <div className="text-xs text-foreground/70 leading-relaxed">
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="font-mono text-[11px] text-foreground/60 mt-1">Contact: +91 {addr.mobile}</p>
                {addr.googleMapsUrl && (
                  <a
                    href={addr.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium text-[11px] inline-flex items-center gap-1 mt-1"
                  >
                    <Navigation size={10} /> View on Google Maps
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-orange-50 text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 size={13} /> Set as Default
                  </button>
                ) : (
                  <span className="text-green-600 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Primary Address
                  </span>
                )}

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">Add New Address</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-orange-50 text-foreground/70 hover:text-primary flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3.5">
              <button
                type="button"
                onClick={handleCaptureLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-3 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-primary font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation size={14} />
                {isLocating ? "Detecting GPS Location..." : "Auto-Pin Current Location"}
              </button>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/70">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full h-11 bg-orange-50/30 border border-orange-100 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/70">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full h-11 bg-orange-50/30 border border-orange-100 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground/70">Street / House / Mandir *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House No, Street, Landmark"
                  className="w-full h-11 bg-orange-50/30 border border-orange-100 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground/70">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 bg-orange-50/30 border border-orange-100 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground/70">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full h-11 bg-orange-50/30 border border-orange-100 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 text-primary rounded accent-primary"
                />
                <span className="text-xs text-foreground/70 font-medium">Make this my default address</span>
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-linear-to-r from-primary to-primary-dark text-white font-bold text-xs rounded-xl shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60 mt-2"
              >
                {isSaving ? "Saving Address..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
