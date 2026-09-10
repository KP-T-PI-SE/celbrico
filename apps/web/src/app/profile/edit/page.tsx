"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Smartphone, Save } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useIsMounted } from "@/lib/useIsMounted";

export default function EditProfilePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const mounted = useIsMounted();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/profile/edit");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        if (res.data.success) {
          setName(res.data.data.name || "");
          setEmail(res.data.data.email || "");
          setMobileNumber(res.data.data.mobileNumber || "");
          updateUser(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router, updateUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSaving(true);
      const res = await api.put("/user/profile", {
        name: name.trim(),
        email: email.trim(),
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        updateUser(res.data.data);
        router.push("/profile");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-sm text-foreground/50">Loading profile...</div>
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
            <h1 className="font-serif text-xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-[10px] text-foreground/60">Update your personal information</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 border border-orange-100/60 shadow-glass space-y-6">
          <div className="flex flex-col items-center pb-2">
            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-primary to-gold flex items-center justify-center text-white font-bold text-3xl shadow-glow">
              {name ? name.charAt(0).toUpperCase() : mobileNumber.charAt(0) || "C"}
            </div>
            <p className="font-mono text-xs text-foreground/60 mt-2">+91 {mobileNumber}</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 ml-1">
                <User size={14} className="text-primary" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full h-12 bg-orange-50/20 border border-orange-100 rounded-2xl px-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 ml-1">
                <Mail size={14} className="text-primary" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full h-12 bg-orange-50/20 border border-orange-100 rounded-2xl px-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 ml-1">
                <Smartphone size={14} className="text-primary" /> Mobile Number
              </label>
              <input
                type="text"
                disabled
                value={`+91 ${mobileNumber}`}
                className="w-full h-12 bg-orange-50/50 border border-orange-100/50 rounded-2xl px-4 text-xs font-medium text-foreground/50 cursor-not-allowed"
              />
              <p className="text-[10px] text-foreground/50 ml-1">Mobile number is verified with PIN authentication.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-linear-to-r from-primary to-primary-dark text-white font-bold text-xs rounded-2xl shadow-glow transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
