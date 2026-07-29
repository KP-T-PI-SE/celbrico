'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Heart, Star, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { BottomSheet } from '@/components/ui/BottomSheet';

export default function ProductPage() {
  const router = useRouter();
  const [isWishlist, setIsWishlist] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [isOffersOpen, setIsOffersOpen] = useState(false);

  const images = [1, 2, 3]; // Mock image indicators

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24 font-sans">
      
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-transparent flex justify-between p-4 max-w-md mx-auto">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-foreground transition-transform active:scale-95">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-foreground transition-transform active:scale-95">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsWishlist(!isWishlist)}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-foreground transition-transform active:scale-95"
          >
            <Heart size={20} className={isWishlist ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="w-full relative aspect-[4/5] bg-muted overflow-hidden">
         {/* Placeholder Image Slider */}
         <motion.div 
            className="w-full h-full flex"
            animate={{ x: `-${activeImage * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
         >
           {images.map(img => (
              <div key={img} className="min-w-full h-full bg-gradient-to-br from-celbrico-ivory to-orange-100 flex items-center justify-center">
                 <span className="text-muted-foreground font-bold">Image {img}</span>
              </div>
           ))}
         </motion.div>
         
         {/* Dots */}
         <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
           {images.map((_, idx) => (
             <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-primary w-4' : 'bg-black/20'}`} 
             />
           ))}
         </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 bg-white dark:bg-neutral-900 -mt-6 relative z-10 rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
         <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-100 text-celbrico-maroon text-[10px] font-bold px-2 py-1 rounded">FESTIVAL SPECIAL</span>
            <div className="flex items-center text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded gap-1">
               <Clock size={12} /> 10 MINS
            </div>
         </div>
         
         <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">Premium Dry Fruits Gift Box (1kg)</h1>
         <p className="text-sm text-muted-foreground mb-4">A handpicked assortment of the finest almonds, cashews, raisins, and pistachios.</p>
         
         <div className="flex items-end justify-between mb-6">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold">₹1,299</span>
                  <span className="text-sm text-muted-foreground line-through">₹1,599</span>
                  <span className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-1 rounded">18% OFF</span>
               </div>
               <span className="text-xs text-muted-foreground">Inclusive of all taxes</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
               <span className="font-bold text-sm text-amber-700">4.8</span>
               <Star size={14} className="fill-amber-500 text-amber-500" />
            </div>
         </div>

         {/* Offers */}
         <button onClick={() => setIsOffersOpen(true)} className="w-full flex items-center justify-between bg-muted/50 p-4 rounded-2xl mb-6 border border-border/50 active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg">🏷️</span>
               </div>
               <div className="text-left">
                  <p className="text-sm font-semibold">Available Offers (3)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Save extra ₹200 with Axis Bank</p>
               </div>
            </div>
            <ArrowLeft size={16} className="rotate-180 text-muted-foreground" />
         </button>

         {/* Trust Signals */}
         <div className="grid grid-cols-3 gap-3 mb-8 border-t border-b border-border/50 py-4">
            <div className="flex flex-col items-center text-center gap-1">
               <div className="text-2xl">🌱</div>
               <span className="text-[10px] font-semibold text-muted-foreground leading-tight">100% Fresh & Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
               <div className="text-2xl">📦</div>
               <span className="text-[10px] font-semibold text-muted-foreground leading-tight">Premium Packaging</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
               <div className="text-2xl">⚡</div>
               <span className="text-[10px] font-semibold text-muted-foreground leading-tight">Lightning Delivery</span>
            </div>
         </div>
         
         {/* Details */}
         <div>
            <h3 className="font-bold text-lg mb-3">Product Details</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
               Celebrate the festival of lights with our meticulously curated dry fruit box. Sourced from the best farms, these nuts provide the perfect crunch and taste.
            </p>
         </div>
      </div>

      {/* Sticky Bottom Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border/50 p-4 pb-safe flex items-center gap-4 max-w-md mx-auto z-40">
         <div className="w-[120px]">
            <QuantityStepper 
               quantity={quantity} 
               onIncrease={() => setQuantity(q => q + 1)} 
               onDecrease={() => setQuantity(q => Math.max(0, q - 1))}
               variant="premium"
               className="w-full h-12 text-lg"
            />
         </div>
         <AnimatedButton 
            className="flex-1" 
            size="lg" 
            onClick={() => router.push('/cart')}
            disabled={quantity === 0}
         >
            {quantity > 0 ? `Checkout (₹${quantity * 1299})` : 'Select Quantity'}
         </AnimatedButton>
      </div>

      {/* Bottom Sheet for Offers */}
      <BottomSheet isOpen={isOffersOpen} onClose={() => setIsOffersOpen(false)} title="Available Offers">
         <div className="space-y-4">
            {[1, 2, 3].map(i => (
               <div key={i} className="border border-border rounded-xl p-4 flex gap-3">
                  <div className="mt-1">🏷️</div>
                  <div>
                     <h4 className="font-bold text-sm">Save Extra ₹200</h4>
                     <p className="text-xs text-muted-foreground mt-1 mb-2">On Axis Bank Credit Cards on min spend of ₹1000.</p>
                     <span className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-2 py-1 rounded bg-primary/5">AXIS200</span>
                  </div>
               </div>
            ))}
         </div>
      </BottomSheet>
      
    </div>
  );
}
