'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import Link from 'next/link';

const categories = ['All', 'Pooja Essentials', 'Sweets', 'Fruits', 'Gifts', 'Decor'];
const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `Premium Item ${i + 1}`,
  price: 199 + i * 50,
  time: '10 MINS',
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
}));

export default function ShopPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const handleQtyChange = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const filteredProducts = activeCategory === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 pt-safe">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search festival items..." 
              className="w-full bg-muted border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-start px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground border-primary shadow-soft' 
                  : 'bg-white text-foreground border-border hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Filter Bar */}
        <div className="px-4 py-2 flex justify-between items-center bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground">{filteredProducts.length} items</span>
          <button className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-white border border-border shadow-sm">
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={product.id}
            >
              <GlassCard className="h-full flex flex-col p-3">
                <Link href={`/product/${product.id}`} className="block relative w-full aspect-square bg-muted rounded-2xl mb-3 overflow-hidden">
                   {/* Placeholder Image */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-muted to-muted-foreground/20" />
                   <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm text-primary">
                     {product.time}
                   </div>
                </Link>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">{product.category}</p>
                  
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="font-bold text-sm">₹{product.price}</span>
                  </div>
                  <div className="mt-3">
                     <QuantityStepper 
                        quantity={quantities[product.id] || 0}
                        onIncrease={() => handleQtyChange(product.id, 1)}
                        onDecrease={() => handleQtyChange(product.id, -1)}
                        variant="premium"
                        className="w-full"
                     />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
