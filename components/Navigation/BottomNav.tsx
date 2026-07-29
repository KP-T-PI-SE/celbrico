'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, CalendarDays, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/shop', icon: LayoutGrid },
    { name: 'Festival', path: '/festivals', icon: CalendarDays },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Profile', path: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 pb-safe pt-2 px-6 max-w-md mx-auto md:border-x md:border-border/40">
      <div className="flex justify-between items-center h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.path} className="relative flex flex-col items-center justify-center w-14 h-full gap-1">
              <Icon size={24} className={isActive ? 'text-primary' : 'text-muted-foreground'} strokeWidth={isActive ? 2.5 : 2} />
              
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.name}
              </span>

              {/* Active Indicator Animation */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
