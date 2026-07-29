'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-celbrico-saffron to-celbrico-maroon"
        >
          {/* Animated Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-6 overflow-hidden">
               {/* Stand-in for real logo */}
               <span className="text-5xl">🪔</span>
            </div>
            
            <h1 className="text-4xl font-heading font-bold text-white tracking-wider mb-2">CELBRICO</h1>
            
            <motion.p 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.8 }}
               className="text-white/80 font-medium tracking-widest text-xs uppercase"
            >
               Celebrate More. Shop Less.
            </motion.p>
          </motion.div>

          {/* Luxury loading indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2"
          >
             {[0, 1, 2].map((i) => (
                <motion.div 
                   key={i}
                   animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                   }}
                   transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                   }}
                   className="w-2 h-2 rounded-full bg-white/80"
                />
             ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
