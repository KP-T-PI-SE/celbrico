'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from '@/components/ui/AnimatedButton';


const slides = [
  {
    id: 1,
    title: "Every Festival,\nDelivered.",
    description: "Your ultimate destination for all festival needs. From pooja samagri to premium gifts.",
    icon: "🪔",
    color: "bg-orange-50"
  },
  {
    id: 2,
    title: "10-Minute\nMagic",
    description: "Forgot something? We deliver authentic and fresh essentials right to your doorstep in minutes.",
    icon: "⚡",
    color: "bg-amber-50"
  },
  {
    id: 3,
    title: "Verified\nPandits",
    description: "Book verified pandits for your home poojas with just a few taps. Hassle-free spirituality.",
    icon: "🙏",
    color: "bg-rose-50"
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  return (
    <div className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${slides[currentSlide].color}`}>
      
      {/* Top Action */}
      <div className="w-full p-6 flex justify-end">
         <button 
            onClick={handleSkip}
            className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
         >
            Skip
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
         <AnimatePresence mode="wait">
           <motion.div
             key={currentSlide}
             initial={{ opacity: 0, scale: 0.8, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 1.1, y: -20 }}
             transition={{ duration: 0.4, type: "spring" }}
             className="flex flex-col items-center"
           >
              <div className="w-48 h-48 bg-white/50 backdrop-blur-xl rounded-full shadow-premium flex items-center justify-center mb-10 text-8xl">
                 {slides[currentSlide].icon}
              </div>
              
              <h1 className="text-3xl font-heading font-bold text-foreground whitespace-pre-line leading-tight mb-4">
                 {slides[currentSlide].title}
              </h1>
              
              <p className="text-muted-foreground text-sm max-w-[260px] leading-relaxed">
                 {slides[currentSlide].description}
              </p>
           </motion.div>
         </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 pb-safe flex flex-col items-center gap-8">
         {/* Dots */}
         <div className="flex gap-2">
            {slides.map((_, i) => (
               <div 
                 key={i} 
                 className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-black/10'
                 }`} 
               />
            ))}
         </div>

         <AnimatedButton 
            onClick={handleNext}
            className="w-full font-bold text-lg"
            size="lg"
         >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
         </AnimatedButton>
      </div>

    </div>
  );
}
