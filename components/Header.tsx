'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Bell, User } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'glass shadow-sm' : 'bg-background'}`}>
      
      {/* Top Banner - Desktop Only */}
      <div className="hidden md:flex bg-secondary text-secondary-foreground text-[11px] font-medium py-1.5 px-6 justify-between items-center">
        <div className="flex gap-4">
          <span>✓ 100% Authentic Samagri</span>
          <span>✓ Verified Pandits</span>
          <span>✓ On-time Delivery</span>
        </div>
        <div className="flex gap-4">
          <Link href="/track" className="hover:text-primary transition-colors">Track Order</Link>
          <Link href="/help" className="hover:text-primary transition-colors">Help Support</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 gap-4">
        
        {/* Left: Location & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <Link href="/" className="text-xl md:text-2xl font-heading font-bold text-primary tracking-tight">
              CELBRICO<span className="text-secondary text-sm">.</span>
            </Link>
            <div className="hidden md:flex items-center text-[10px] text-muted-foreground gap-1">
              <MapPin size={10} /> 
              <span>Delivering to <strong className="text-foreground">Mumbai 400001</strong></span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar (Expanded on Desktop) */}
        <div className="flex-1 max-w-xl hidden md:block relative group">
          <input suppressHydrationWarning
            type="text" 
            placeholder="Search for festivals, pooja kits, or pandits..." 
            className="w-full bg-muted/50 border border-border/50 text-sm rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <button suppressHydrationWarning className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors">
            <Search size={20} className="text-foreground" />
          </button>
          <button suppressHydrationWarning className="p-2 rounded-full hover:bg-muted/50 transition-colors relative">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background"></span>
          </button>
          <Link href="/account" className="hidden md:flex items-center gap-2 p-2 rounded-full hover:bg-muted/50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={16} />
            </div>
          </Link>
        </div>
      </div>
      
    </header>
  );
}
