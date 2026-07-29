'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Heart } from 'lucide-react';

import { Splash } from '@/components/Splash';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Recommended');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if it's a first time visit (mocking logic)
    const hasSeenOnboarding = localStorage.getItem('celbrico_onboarding');
    
    if (hasSeenOnboarding) {
      setTimeout(() => setShowSplash(false), 0);
    }
    // If not seen, showSplash remains true. Splash component handles its own timeout.
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem('celbrico_onboarding', 'true');
    router.push('/onboarding');
  };

  const categories = [
    { name: 'Kits', icon: '🎁', color: 'bg-orange-100' },
    { name: 'Flowers', icon: '🏵️', color: 'bg-pink-100' },
    { name: 'Samagri', icon: '🪔', color: 'bg-yellow-100' },
    { name: 'Sweets', icon: '🍬', color: 'bg-green-100' },
    { name: 'Pandit', icon: '🙏', color: 'bg-blue-100' },
    { name: 'Gifts', icon: '💝', color: 'bg-purple-100' },
  ];

  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <div className="w-full overflow-hidden pb-12">
      
      {/* Luxury Hero Carousel */}
      <section className="px-4 mt-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-celbrico-saffron to-celbrico-maroon flex flex-col justify-end p-6 md:p-10 shadow-2xl"
        >
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 max-w-xl text-white">
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4"
            >
              FESTIVAL COUNTDOWN
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4"
            >
              Ganesh Chaturthi is almost here.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-white/90 text-sm md:text-base mb-6 max-w-md"
            >
              Get everything you need for the perfect celebration delivered in 10 minutes.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link href="/festivals/ganesh" className="inline-flex items-center justify-center bg-white text-celbrico-maroon font-bold rounded-full px-8 py-3.5 shadow-lg hover:scale-105 transition-transform">
                Shop Essentials <ChevronRight size={18} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Quick Categories (Native App Style Horizontal Scroll) */}
      <section className="mb-10 pl-4 md:px-6">
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 snap-start min-w-[72px]"
            >
              <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-2xl shadow-sm border border-black/5`}>
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-foreground">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Action Banners Grid */}
      <section className="px-4 md:px-6 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/services/daadi" className="relative h-32 md:h-48 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 p-4 md:p-6 group">
            <h3 className="font-heading font-bold text-emerald-900 text-lg md:text-xl">Ask AI Daadi</h3>
            <p className="text-xs text-emerald-700 mt-1 max-w-[120px]">Your personal festival guide.</p>
            <div className="absolute right-0 bottom-0 text-5xl translate-x-2 translate-y-2 group-hover:scale-110 transition-transform">👵🏽</div>
          </Link>
          
          <Link href="/services/pandit" className="relative h-32 md:h-48 rounded-2xl overflow-hidden bg-orange-50 border border-orange-100 p-4 md:p-6 group">
            <h3 className="font-heading font-bold text-orange-900 text-lg md:text-xl">Book Pandit</h3>
            <p className="text-xs text-orange-700 mt-1 max-w-[120px]">Verified online & offline poojas.</p>
            <div className="absolute right-0 bottom-0 text-5xl translate-x-2 translate-y-2 group-hover:scale-110 transition-transform">🕉️</div>
          </Link>
        </div>
      </section>

      {/* Dynamic Tabbed Content */}
      <section className="mb-12">
        <div className="px-4 md:px-6 flex gap-6 border-b border-border mb-6 overflow-x-auto hide-scrollbar">
          {['Recommended', 'Festival Kits', 'Daily Essentials', 'Sweets'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Product Grid Horizontal Scroll */}
        <div className="pl-4 md:px-6 flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
          {[1, 2, 3, 4, 5].map((item) => (
            <motion.div 
              key={item}
              whileHover={{ y: -4 }}
              className="min-w-[160px] md:min-w-[200px] snap-start bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="relative w-full aspect-square bg-muted">
                <button className="absolute top-2 right-2 p-1.5 bg-white/50 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 transition-colors">
                  <Heart size={16} />
                </button>
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                  <Clock size={10} className="text-primary"/> 10 MINS
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h4 className="font-semibold text-sm leading-tight mb-1 text-foreground">Premium Pooja Kit</h4>
                <p className="text-[10px] text-muted-foreground mb-2">22 Items included</p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm">₹699</span>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Callout */}
      <section className="px-4 md:px-6 mb-12">
        <div className="bg-celbrico-ivory rounded-3xl p-6 md:p-8 flex items-center justify-between border border-primary/10">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-celbrico-maroon mb-2">Join Celbrico Plus</h2>
            <p className="text-sm text-foreground/80 mb-4 max-w-[200px]">Get free deliveries & exclusive early access to festival sales.</p>
            <button className="bg-celbrico-maroon text-white text-xs font-bold px-4 py-2 rounded-full">
              Explore Plans
            </button>
          </div>
          <div className="text-6xl">
            ✨
          </div>
        </div>
      </section>
      
    </div>
  );
}
