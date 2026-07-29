import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming shadcn cn utility exists

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function GlassCard({ children, className, interactive = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4, scale: 1.01 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      className={cn(
        "glass rounded-3xl p-4 shadow-soft transition-shadow hover:shadow-premium overflow-hidden relative",
        className
      )}
      {...props}
    >
      {/* Subtle shine effect overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
