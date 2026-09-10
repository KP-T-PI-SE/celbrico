"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Smartphone, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AdminLoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!mobileNumber.trim() || !pin.trim()) {
      toast.error("Please enter staff phone and PIN");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/auth/login-pin", {
        mobileNumber: mobileNumber.trim(),
        pin: pin.trim(),
      });

      if (res.data.success) {
        const user = res.data.user;

        // Strict role verification: Reject non-admins from the Admin Portal
        if (user.role !== "admin") {
          setErrorMessage(
            "Access Denied: This account does not possess store administrator privileges. Please use the Customer Storefront login."
          );
          toast.error("Non-admin account. Access restricted.");
          return;
        }

        login(user, res.data.token);
        toast.success("Administrator Authenticated!");
        router.push("/admin");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err.response?.data?.message || "Invalid administrative credentials";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft size={14} /> Back to Customer Storefront
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Internal Portal v1.0</span>
        </div>
      </div>

      {/* Center Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-primary/20 to-amber-500/20 border border-primary/30 text-primary mx-auto flex items-center justify-center shadow-glow mb-3">
              <Shield size={28} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Celbrico Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Staff & Operations Management Authentication
            </p>
          </div>

          {/* Error banner if non-admin attempts login */}
          {errorMessage && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-2.5 text-red-400 text-xs leading-relaxed">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <div>
                <span>{errorMessage}</span>
                <div className="mt-2">
                  <Link
                    href="/login"
                    className="text-white font-bold underline hover:text-red-200 text-xs inline-block"
                  >
                    Go to Customer Sign In &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 ml-1">Admin Mobile Number</label>
              <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden h-12">
                <div className="flex items-center gap-1 px-3.5 h-full border-r border-slate-800 text-slate-400 text-xs font-semibold bg-slate-900/50">
                  <Smartphone size={14} className="text-primary" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9999999999"
                  className="w-full h-full bg-transparent px-3.5 text-xs text-white font-medium outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 ml-1">Admin Security PIN</label>
              <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden h-12">
                <div className="pl-3.5 text-slate-500 pointer-events-none">
                  <Lock size={15} />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full h-full bg-transparent pl-3 pr-10 text-xs text-white font-medium outline-none placeholder:text-slate-600 tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-linear-to-r from-primary to-amber-600 hover:from-primary-dark hover:to-amber-700 text-white font-bold text-xs rounded-2xl shadow-glow transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating Staff...</span>
              ) : (
                <>
                  <Shield size={14} /> Authorize & Access Portal
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              Default Seed Administrator: <span className="font-mono text-slate-400 font-semibold">+91 9999999999</span> | PIN: <span className="font-mono text-slate-400 font-semibold">1234</span>
            </p>
            <div className="pt-1">
              <Link
                href="/login"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Not staff? Go to Customer / Shopper Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 w-full text-center py-4 border-t border-slate-900 text-[10px] text-slate-600 font-mono">
        &copy; {new Date().getFullYear()} Celbrico Inc. Authorized Personnel Only. Session activities logged.
      </div>
    </main>
  );
}
