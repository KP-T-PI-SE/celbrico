"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function OTPPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const setTempToken = useAuthStore((state) => state.setTempToken);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/auth/send-otp", { mobileNumber });
      if (res.data.success) {
        toast.success("OTP sent to your number");
        setStep(2);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/auth/verify-otp", { mobileNumber, otp: otpValue });
      
      if (res.data.success) {
        toast.success("OTP Verified Successfully!");
        setTempToken(res.data.tempToken);
        
        if (res.data.hasPin) {
          router.push("/set-pin");
        } else {
          router.push("/set-pin");
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col px-6 pt-12 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/mandala-bg.svg')] bg-no-repeat bg-cover bg-center opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md mx-auto">
        <button onClick={() => step === 2 ? setStep(1) : router.back()} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-orange-50 mb-8 text-foreground/80 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </button>

        {step === 1 ? (
          <>
            <div className="mb-10">
              <h1 className="font-serif text-3xl text-foreground font-bold mb-2">Login with OTP</h1>
              <p className="text-sm text-foreground/70">
                Enter your mobile number to receive a secure OTP for login.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-8">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 ml-1">Mobile Number</label>
                <div className="relative flex items-center bg-white border border-orange-100/60 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all overflow-hidden h-13">
                  <div className="flex items-center gap-1.5 px-4 h-full border-r border-orange-100/60 bg-orange-50/30">
                    <Smartphone size={16} className="text-primary" />
                    <span className="text-sm font-medium">+91</span>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-primary to-primary-light text-white font-medium rounded-xl py-4 shadow-glow flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] text-sm"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="font-serif text-3xl text-foreground font-bold mb-2">Verify Mobile</h1>
              <p className="text-sm text-foreground/70">
                Please enter the 4-digit code sent to<br/>
                <span className="font-medium text-foreground">+91 {mobileNumber}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-10">
              <div className="flex justify-between max-w-70 mx-auto gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    className="w-14 h-14 text-center text-2xl font-bold bg-white border border-orange-100/50 rounded-2xl shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>

              <div className="text-center">
                 <p className="text-xs text-foreground/60 mb-2">Didn&apos;t receive the code?</p>
                 <button type="button" onClick={handleSendOTP} className="text-sm font-medium text-primary hover:underline">
                   Resend Code
                 </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-primary to-primary-dark text-white font-medium rounded-xl py-4 shadow-glow flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <MessageSquare size={18} /> {isLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
