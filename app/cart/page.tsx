'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tag, ChevronRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

const initialItems = [
  { id: 1, name: 'Premium Dry Fruits Gift Box', price: 1299, originalPrice: 1599, qty: 1, img: '📦' },
  { id: 2, name: 'Ganesh Chaturthi Pooja Kit', price: 699, originalPrice: 999, qty: 1, img: '🪔' }
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalOriginal = items.reduce((acc, item) => acc + (item.originalPrice * item.qty), 0);
  const savings = totalOriginal - total;

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-32">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50 pt-safe px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="font-bold text-lg leading-tight">Your Cart</h1>
           <p className="text-xs text-muted-foreground">{items.length} items • Delivery in 10 mins</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 px-4">
           <div className="text-6xl mb-4">🛒</div>
           <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
           <p className="text-muted-foreground text-center mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
           <AnimatedButton onClick={() => router.push('/')}>Start Shopping</AnimatedButton>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          
          {/* Delivery Address Banner */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-celbrico-maroon flex items-center justify-center">
                   <MapPin size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-sm">Delivery at Home</h3>
                   <p className="text-xs text-muted-foreground truncate max-w-[200px]">123, Jubilee Hills, Hyderabad...</p>
                </div>
             </div>
             <button className="text-sm font-bold text-primary">Change</button>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-border flex gap-4"
                >
                  <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center text-4xl">
                     {item.img}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                        <h3 className="font-semibold text-sm leading-tight text-foreground">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">₹{item.price} <span className="line-through text-[10px]">₹{item.originalPrice}</span></p>
                     </div>
                     <div className="flex items-center justify-between mt-3">
                        <span className="font-bold">₹{item.price * item.qty}</span>
                        <div className="w-[100px]">
                           <QuantityStepper 
                             quantity={item.qty} 
                             onIncrease={() => updateQty(item.id, 1)}
                             onDecrease={() => updateQty(item.id, -1)}
                           />
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Coupon */}
          <button className="w-full bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between active:scale-[0.98] transition-transform">
             <div className="flex items-center gap-3">
                <Tag size={20} className="text-primary" />
                <span className="font-semibold text-sm">Apply Coupon Code</span>
             </div>
             <ChevronRight size={18} className="text-muted-foreground" />
          </button>

          {/* Bill Details */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-border">
             <h3 className="font-bold mb-4">Bill Details</h3>
             <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                   <span>Item Total</span>
                   <span>₹{totalOriginal}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                   <span>Product Discount</span>
                   <span>-₹{savings}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                   <span>Delivery Fee</span>
                   <span><span className="line-through mr-1 text-xs">₹50</span> <span className="text-green-600">FREE</span></span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-bold text-base">
                   <span>Grand Total</span>
                   <span>₹{total}</span>
                </div>
             </div>
             
             {/* Savings Banner */}
             <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                <div className="text-2xl">🎉</div>
                <div>
                   <p className="text-xs font-bold text-green-800">Yay! You saved ₹{savings} on this order</p>
                   <p className="text-[10px] text-green-700">Free delivery applied.</p>
                </div>
             </div>
          </div>
          
        </div>
      )}

      {/* Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border/50 p-4 pb-safe max-w-md mx-auto z-40">
           <AnimatedButton 
              className="w-full flex items-center justify-between px-6" 
              size="lg"
              onClick={() => router.push('/checkout')}
           >
              <div className="flex flex-col items-start">
                 <span className="text-[10px] font-medium opacity-80">TOTAL</span>
                 <span className="font-bold text-lg">₹{total}</span>
              </div>
              <div className="flex items-center font-bold text-lg">
                 Checkout <ChevronRight size={20} className="ml-1" />
              </div>
           </AnimatedButton>
        </div>
      )}
      
    </div>
  );
}
