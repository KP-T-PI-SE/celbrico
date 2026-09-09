"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function SetPinPage() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const clearTempToken = useAuthStore((state) => state.clearTempToken);

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    
    if (pin.length < 4 || pin.length > 6) {
      toast.error("PIN must be 4 to 6 digits");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/auth/set-pin", { pin });
      if (res.data.success) {
        toast.success("PIN set successfully! You are now logged in.");
        clearTempToken();
        if (res.data.user && res.data.token) {
          login(res.data.user, res.data.token);
        }
        router.push("/");
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to set PIN. Session may have expired.");
      if (err.response?.status === 401) {
        router.push("/otp");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-center px-6 overflow-hidden pt-10">
      <div className="absolute top-0 right-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/mandala-bg.svg')] bg-no-repeat bg-cover bg-center opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-glass mx-auto mb-4 text-primary border border-orange-50">
            <Lock size={28} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Secure Your Account</h1>
          <p className="text-sm text-foreground/70 mt-2">
            Create a 4-6 digit PIN for fast and secure logins.
          </p>
        </div>

        <form onSubmit={handleSetPin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/80 ml-1">Create PIN</label>
            <div className="relative bg-white border border-orange-100/60 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all h-13">
              <input
                type="password"
                className="w-full h-full bg-transparent px-4 text-center tracking-[1em] text-lg outline-none font-medium"
                placeholder="••••"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/80 ml-1">Confirm PIN</label>
            <div className="relative bg-white border border-orange-100/60 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all h-13">
              <input
                type="password"
                className="w-full h-full bg-transparent px-4 text-center tracking-[1em] text-lg outline-none font-medium"
                placeholder="••••"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-orange-50/50 rounded-xl border border-orange-100/50 text-[11px] text-foreground/70">
            <ShieldCheck size={16} className="text-primary shrink-0" />
            <span>This PIN will be requested each time you sign in with your mobile number.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-primary to-primary-dark text-white font-semibold rounded-2xl py-4 shadow-glow flex items-center justify-center gap-2 mt-8 hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {isLoading ? "Saving PIN..." : "Save PIN & Start Shopping"} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}
