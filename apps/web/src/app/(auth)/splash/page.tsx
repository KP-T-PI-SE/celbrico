"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Truck, ShieldCheck } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/mandala-bg.svg')] bg-no-repeat bg-cover bg-center opacity-5 pointer-events-none" />

      {/* Main Logo Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-glass relative mb-8">
          <div className="absolute inset-0 bg-linear-to-br from-primary to-gold opacity-10 rounded-full" />
          
          {/* Main Diya / Mandala Logo placeholder */}
          <div className="w-32 h-32 rounded-full border-2 border-primary/20 flex flex-col items-center justify-center text-primary relative">
             <div className="absolute inset-0 rotate-45 border-2 border-primary/10 rounded-[30%]"></div>
             <div className="text-4xl">🪔</div>
          </div>
        </div>

        <h1 className="font-serif text-6xl text-primary font-bold tracking-tight mb-4 drop-shadow-sm">Celbrico</h1>
        
        <div className="flex items-center gap-4 mb-4 w-full max-w-xs">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-primary/40" />
          <div className="w-2 h-2 rotate-45 bg-primary/40" />
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-primary/40" />
        </div>

        <p className="text-sm font-medium tracking-wide text-foreground/80">Every Festival, Delivered.</p>
      </div>

      {/* Bottom Features Area */}
      <div className="pb-16 pt-8 relative z-10 px-6">
        <div className="flex justify-between items-start mb-16">
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-14 h-14 rounded-full bg-white border border-primary/10 text-primary flex items-center justify-center mb-3 shadow-sm">
              <Box size={24} />
            </div>
            <p className="text-xs font-semibold text-foreground/90">Pooja Essentials</p>
            <p className="text-[10px] text-foreground/60">Wide Range</p>
          </div>
          
          <div className="w-px h-16 bg-primary/10 mt-2" />
          
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-14 h-14 rounded-full bg-white border border-primary/10 text-primary flex items-center justify-center mb-3 shadow-sm">
              <Truck size={24} />
            </div>
            <p className="text-xs font-semibold text-foreground/90">Fast Delivery</p>
            <p className="text-[10px] text-foreground/60">Across India</p>
          </div>

          <div className="w-px h-16 bg-primary/10 mt-2" />
          
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-14 h-14 rounded-full bg-white border border-primary/10 text-primary flex items-center justify-center mb-3 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <p className="text-xs font-semibold text-foreground/90">Trusted & Pure</p>
            <p className="text-[10px] text-foreground/60">100% Authentic</p>
          </div>
        </div>

        {/* Footer Graphic Placeholder */}
        <div className="w-full flex justify-center relative">
           <div className="w-full max-w-sm h-32 bg-linear-to-t from-primary/20 to-transparent rounded-t-[100px] border-t-2 border-primary/30 flex items-end justify-center pb-6 relative overflow-hidden">
             <div className="absolute -inset-4 bg-gold/10 blur-xl"></div>
             <p className="text-sm text-foreground font-medium relative z-10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
                Delivering Happiness to Your Doorstep
                <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
             </p>
           </div>
        </div>
      </div>
    </main>
  );
}
