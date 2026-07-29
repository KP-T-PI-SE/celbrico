'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'premium';
}

export function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  max = 99,
  className,
  variant = 'default'
}: QuantityStepperProps) {
  
  if (quantity <= min) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onIncrease}
        className={cn(
          "h-9 px-4 rounded-full text-sm font-semibold flex items-center justify-center transition-colors",
          variant === 'premium' 
            ? "bg-primary text-primary-foreground shadow-soft hover:shadow-premium" 
            : "bg-muted text-foreground border border-border/50",
          className
        )}
      >
        ADD TO CART
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "h-9 flex items-center justify-between rounded-full px-1 shadow-soft",
        variant === 'premium' ? "bg-primary text-primary-foreground" : "bg-white border border-border",
        className
      )}
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={onDecrease}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full",
          variant === 'premium' ? "text-primary-foreground hover:bg-white/20" : "text-foreground hover:bg-muted"
        )}
      >
        <Minus size={16} strokeWidth={2.5} />
      </motion.button>
      
      <div className="w-8 flex items-center justify-center font-bold text-sm relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={quantity}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={onIncrease}
        disabled={quantity >= max}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50",
          variant === 'premium' ? "text-primary-foreground hover:bg-white/20" : "text-foreground hover:bg-muted"
        )}
      >
        <Plus size={16} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}
