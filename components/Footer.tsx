'use client';
import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-24 md:pb-8 rounded-t-3xl mt-12">
      <div className="container px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">CELBRICO</h3>
            <p className="text-sm mb-6 max-w-xs">India&apos;s most premium Festival Commerce Platform. Celebrate More. Shop Less.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/festivals" className="hover:text-primary transition-colors">Festivals</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Pooja Samagri</Link></li>
              <li><Link href="/kits" className="hover:text-primary transition-colors">Pooja Kits</Link></li>
              <li><Link href="/sweets" className="hover:text-primary transition-colors">Sweets & Prasad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/pandit" className="hover:text-primary transition-colors">Book a Pandit</Link></li>
              <li><Link href="/services/daadi" className="hover:text-primary transition-colors">Ask AI Daadi</Link></li>
              <li><Link href="/bulk" className="hover:text-primary transition-colors">Corporate Gifting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Kalpapreeth IT Solutions Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
