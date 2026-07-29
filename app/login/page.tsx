'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ArrowLeft, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setIsOtpSent(true);
    }
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      // Simulate successful login
      router.push('/');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-neutral-900 flex flex-col font-sans">
      
      {/* Header */}
      <div className="p-4 pt-safe flex items-center">
         <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft size={24} />
         </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6 pb-safe">
         
         {/* Branding / Illustration */}
         <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-4xl shadow-sm border border-primary/20 mb-6">
               🪔
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground mb-2">Welcome to Celbrico</h1>
            <p className="text-muted-foreground text-sm text-center max-w-[240px]">
               Log in to access your saved addresses, orders, and exclusive offers.
            </p>
         </div>

         {/* Form Area */}
         <div className="flex-1">
            <AnimatePresence mode="wait">
               {!isOtpSent ? (
                  <motion.div
                     key="phone"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                  >
                     <div className="relative">
                        <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <div className="absolute left-11 top-1/2 -translate-y-1/2 text-foreground font-semibold border-r border-border pr-3">
                           +91
                        </div>
                        <input
                           type="tel"
                           maxLength={10}
                           value={phone}
                           onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                           placeholder="Mobile Number"
                           className="w-full bg-white border-2 border-border rounded-2xl py-4 pl-[84px] pr-4 font-semibold text-lg focus:border-primary focus:ring-0 outline-none transition-colors"
                        />
                     </div>
                     
                     <AnimatedButton 
                        className="w-full" 
                        size="lg" 
                        disabled={phone.length !== 10}
                        onClick={handleSendOtp}
                     >
                        Get OTP
                     </AnimatedButton>
                  </motion.div>
               ) : (
                  <motion.div
                     key="otp"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                  >
                     <div className="text-center mb-6">
                        <p className="text-sm text-muted-foreground">Enter 4-digit code sent to</p>
                        <p className="font-bold text-foreground mt-1">+91 {phone} <button onClick={() => setIsOtpSent(false)} className="text-primary text-xs ml-2 underline">Edit</button></p>
                     </div>
                     
                     <div className="flex justify-center gap-4 mb-8">
                        {/* Mock OTP Inputs */}
                        {[1, 2, 3, 4].map(i => (
                           <input 
                              key={i}
                              type="text"
                              maxLength={1}
                              className="w-14 h-14 bg-white border-2 border-border rounded-2xl text-center text-xl font-bold focus:border-primary outline-none"
                              onChange={(e) => {
                                 const newOtp = otp + e.target.value;
                                 setOtp(newOtp);
                              }}
                           />
                        ))}
                     </div>
                     
                     <AnimatedButton 
                        className="w-full" 
                        size="lg" 
                        disabled={otp.length !== 4}
                        onClick={handleVerify}
                     >
                        Verify & Login
                     </AnimatedButton>
                     
                     <p className="text-center text-xs text-muted-foreground mt-6">
                        Didn&apos;t receive code? <button className="font-bold text-foreground">Resend in 00:30</button>
                     </p>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Alternative Login */}
         {!isOtpSent && (
            <div className="mt-8 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs font-semibold text-muted-foreground">OR</span>
                  <div className="h-px bg-border flex-1" />
               </div>
               
               <button className="w-full bg-white border border-border rounded-2xl p-4 font-semibold text-sm flex items-center justify-center gap-3 hover:bg-muted/50 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
               </button>
               
               <p className="text-[10px] text-center text-muted-foreground mt-6">
                  By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
               </p>
            </div>
         )}
      </div>

    </div>
  );
}
