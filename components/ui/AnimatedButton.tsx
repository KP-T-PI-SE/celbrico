'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className,
  children,
  disabled,
  ...props 
}: AnimatedButtonProps) {
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-soft hover:shadow-premium hover:opacity-95",
    secondary: "bg-secondary text-secondary-foreground shadow-soft hover:shadow-premium",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-foreground hover:bg-muted"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-12 px-6 text-sm font-semibold",
    lg: "h-14 px-8 text-base font-bold",
    icon: "h-12 w-12 flex items-center justify-center"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      disabled={disabled || isLoading}
      className={cn(
        "rounded-full relative overflow-hidden transition-all flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Ripple/Shine overlay could be added here via another motion div on click */}
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      {!isLoading && children}
    </motion.button>
  );
}
