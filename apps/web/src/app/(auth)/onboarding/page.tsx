"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { ArrowRight, Leaf, ShieldCheck, Box, Clock, Truck, Award } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Freshness & Trust",
    description: "Handpicked fresh produce and premium groceries you can trust, delivered with care.",
    features: [
      { icon: <Leaf size={24} />, text: "Farm Fresh\nProduce" },
      { icon: <Award size={24} />, text: "Premium\nQuality" },
      { icon: <Box size={24} />, text: "Hygienic\nPacking" }
    ],
    imageType: "groceries" // Placeholder for actual image
  },
  {
    id: 2,
    title: "Pooja & Groceries\nDelivered",
    description: "Authentic festival essentials, premium groceries and pooja items delivered to your doorstep with care and devotion.",
    features: [
      { icon: <Award size={24} />, text: "100% Authentic\nPooja Items" },
      { icon: <Truck size={24} />, text: "Fast & Reliable\nDelivery" },
      { icon: <ShieldCheck size={24} />, text: "Secure\nPayments" }
    ],
    imageType: "pooja"
  },
  {
    id: 3,
    title: "Fast Delivery\nfor All Festivals",
    description: "Your favorite pooja items and groceries, delivered on time, every time.",
    features: [
      { icon: <Clock size={24} />, text: "Super Fast\nDelivery" },
      { icon: <Award size={24} />, text: "On-Time for\nEvery Festival" },
      { icon: <ShieldCheck size={24} />, text: "Safe & Secure\nHandling" }
    ],
    imageType: "delivery"
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      if (selectedIndex === slides.length - 1) {
        router.push("/login");
      } else {
        emblaApi.scrollNext();
      }
    }
  }, [emblaApi, selectedIndex, router]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/mandala-bg.svg')] bg-no-repeat bg-cover bg-top opacity-5 pointer-events-none" />

      {/* Header Logo */}
      <div className="pt-12 pb-6 flex flex-col items-center relative z-10">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-glass relative mb-4">
          <div className="absolute inset-0 bg-linear-to-br from-primary to-gold opacity-10 rounded-full" />
          <div className="w-16 h-16 bg-linear-to-br from-primary to-gold rounded-full flex items-center justify-center text-white font-serif text-3xl">C</div>
          {/* In a real app, this would be the actual image logo */}
        </div>
        <h1 className="font-serif text-3xl text-primary font-bold tracking-tight">Celbrico</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 mt-1">Every Festival, Delivered.</p>
      </div>

      {/* Carousel */}
      <div className="flex-1 relative z-10 flex flex-col">
        <div className="overflow-hidden flex-1" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-end px-6 pb-4">
                
                {/* Image Placeholder (would be Cloudinary images) */}
                <div className="flex-1 w-full max-h-[45vh] relative flex items-center justify-center mb-8">
                  {/* Using a placeholder div for the beautiful imagery shown in references */}
                  <div className="w-full h-full bg-linear-to-b from-transparent to-primary/5 rounded-3xl flex items-center justify-center text-primary/30 font-serif italic border border-primary/10">
                    [Image: {slide.imageType}]
                  </div>
                </div>

                <div className="w-full bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-glass border border-white relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-orange-50 text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  
                  <h2 className="font-serif text-3xl font-bold text-center text-primary-dark mt-2 mb-4 whitespace-pre-line leading-tight">
                    {slide.title}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                     <div className="h-px w-8 bg-primary/20" />
                     <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
                     <div className="h-px w-8 bg-primary/20" />
                  </div>

                  <p className="text-center text-sm text-foreground/70 mb-8 px-4 leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex justify-between items-start gap-2 mb-8">
                    {slide.features.map((feature, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center flex-1">
                        <div className="w-12 h-12 rounded-full border border-primary/20 text-primary flex items-center justify-center mb-2">
                          {feature.icon}
                        </div>
                        <p className="text-[10px] font-medium text-foreground/80 whitespace-pre-line">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === selectedIndex ? "w-6 bg-primary" : "w-2 bg-primary/20"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={scrollNext}
                    className="w-full bg-linear-to-r from-primary to-primary-light text-white font-medium rounded-full py-4 shadow-glow flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] text-lg"
                  >
                    Get Started <ArrowRight size={20} className="bg-white/20 rounded-full p-0.5" />
                  </button>
                  
                  {slide.id === 3 && (
                    <p className="text-center mt-4 text-[10px] text-primary/80 font-medium flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" /> Bringing Festivals Closer to You <div className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
