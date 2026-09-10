"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Smartphone, ChevronDown, CheckCircle2, ShieldCheck, Truck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || !pin) {
      toast.error("Please enter mobile number and PIN");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login-pin", { mobileNumber, pin });
      if (res.data.success) {
        login(res.data.user, res.data.token);
        toast.success("Login Successful!");
        
        const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const redirectParam = urlParams?.get("redirect");
        
        if (redirectParam) {
          router.push(redirectParam);
        } else if (res.data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/mandala-bg.svg')] bg-no-repeat bg-cover bg-center opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto pt-10 px-6 flex-1 flex flex-col">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-glass relative mb-3">
            <div className="absolute inset-0 bg-linear-to-br from-primary to-gold opacity-10 rounded-full" />
            <div className="w-12 h-12 bg-linear-to-br from-primary to-gold rounded-full flex items-center justify-center text-white font-serif text-2xl shadow-glow">C</div>
          </div>
          <h1 className="font-serif text-3xl text-primary font-bold tracking-tight">Celbrico</h1>
          
          <div className="flex items-center gap-3 my-2 w-full max-w-50">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-primary/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-primary/30" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60">Every Festival, Delivered.</p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1 h-1 rotate-45 bg-primary/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
            <div className="w-1 h-1 rotate-45 bg-primary/40" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Welcome to <span className="text-primary">Celbrico</span>
          </h2>
          <p className="text-xs text-foreground/70 mt-2 max-w-70 mx-auto leading-relaxed">
            Sign in to continue and get festival essentials delivered to your doorstep.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/80 ml-1">Mobile Number</label>
            <div className="relative flex items-center bg-white border border-orange-100/60 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all overflow-hidden h-13">
              <div className="flex items-center gap-1.5 px-4 h-full border-r border-orange-100/60 bg-orange-50/30 cursor-pointer">
                <Smartphone size={16} className="text-primary" />
                <span className="text-sm font-medium">+91</span>
                <ChevronDown size={14} className="text-foreground/50" />
              </div>
              <input
                type="tel"
                className="w-full h-full bg-transparent pl-4 pr-4 text-sm outline-none placeholder:text-foreground/40 font-medium"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground/80 ml-1">PIN</label>
            <div className="relative bg-white border border-orange-100/60 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all overflow-hidden h-13">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary">
                <Lock size={16} />
              </div>
              <input
                type={showPin ? "text" : "password"}
                className="w-full h-full bg-transparent pl-11 pr-12 text-sm outline-none placeholder:text-foreground/40 font-medium tracking-widest"
                placeholder="Enter your 4-6 digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-foreground/40 hover:text-primary transition-colors"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground/70 cursor-pointer group">
              <div className="w-4 h-4 rounded border border-orange-200 bg-white flex items-center justify-center group-hover:border-primary transition-colors">
                 {/* Checkbox mock */}
                 <div className="w-2.5 h-2.5 bg-primary rounded-xs opacity-100" />
              </div>
              Remember PIN
            </label>
            <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot PIN?</button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-primary to-primary-light text-white font-semibold rounded-2xl py-4 shadow-glow flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] text-sm mt-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            <Lock size={16} /> {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 mb-6">
          <div className="relative flex items-center py-2">
            <div className="grow border-t border-orange-100/60"></div>
            <span className="shrink-0 mx-4 text-[10px] text-foreground/50 uppercase tracking-widest font-medium">or continue with</span>
            <div className="grow border-t border-orange-100/60"></div>
          </div>
          
          <div className="flex justify-center gap-12 mt-6">
            <Link href="/otp" className="flex flex-col items-center gap-2 group">
               <div className="w-14 h-14 bg-white rounded-full shadow-glass border border-orange-50 flex items-center justify-center text-green-500 group-hover:scale-105 group-hover:shadow-glow transition-all">
                  <FaWhatsapp size={26} />
               </div>
               <span className="text-[10px] font-semibold text-foreground/70 text-center">Continue with<br/>WhatsApp</span>
            </Link>
            <Link href="/otp" className="flex flex-col items-center gap-2 group">
               <div className="w-14 h-14 bg-white rounded-full shadow-glass border border-orange-50 flex items-center justify-center text-primary group-hover:scale-105 group-hover:shadow-glow transition-all">
                  <Smartphone size={24} />
               </div>
               <span className="text-[10px] font-semibold text-foreground/70 text-center">Login with<br/>OTP</span>
            </Link>
          </div>

          <div className="mt-7 pt-4 border-t border-orange-100/60 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors"
            >
              <span>Store Administrator or Staff?</span>
              <span className="font-bold underline text-primary">Admin Sign In &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="relative z-10 w-full">
        {/* Trust Badges */}
        <div className="flex justify-between px-8 py-6 border-t border-orange-50/50 bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-1 justify-center">
            <div className="text-primary"><ShieldCheck size={18} strokeWidth={1.5} /></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-foreground/80 leading-tight">Secure &</span>
              <span className="text-[9px] font-bold text-foreground/80 leading-tight">Trusted</span>
            </div>
          </div>
          <div className="w-px h-6 bg-orange-100/50" />
          <div className="flex items-center gap-2 flex-1 justify-center">
            <div className="text-primary"><CheckCircle2 size={18} strokeWidth={1.5} /></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-foreground/80 leading-tight">100% Authentic</span>
              <span className="text-[9px] font-bold text-foreground/80 leading-tight">Products</span>
            </div>
          </div>
          <div className="w-px h-6 bg-orange-100/50" />
          <div className="flex items-center gap-2 flex-1 justify-center">
            <div className="text-primary"><Truck size={18} strokeWidth={1.5} /></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-foreground/80 leading-tight">Fast & Reliable</span>
              <span className="text-[9px] font-bold text-foreground/80 leading-tight">Delivery</span>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom */}
        <div className="h-16 w-full bg-linear-to-t from-gold/20 to-transparent flex items-end justify-center pb-2">
           <div className="flex gap-10 opacity-60">
             <span className="text-2xl">🪔</span>
             <span className="text-3xl relative -top-2">🪔</span>
             <span className="text-2xl">🪔</span>
           </div>
        </div>
      </div>
    </main>
  );
}
