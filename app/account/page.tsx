'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Package, Heart, MapPin, Bell, LogOut, ChevronRight, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  
  const menuItems = [
    { icon: Package, label: 'Your Orders', desc: 'Track, return, or buy things again', path: '/orders' },
    { icon: Heart, label: 'Wishlist', desc: 'Your saved items', path: '/wishlist' },
    { icon: MapPin, label: 'Addresses', desc: 'Edit or add new addresses', path: '/addresses' },
    { icon: Bell, label: 'Notifications', desc: 'Manage alerts and updates', path: '/notifications' },
    { icon: Settings, label: 'Settings', desc: 'Privacy, Security, Language', path: '/settings' },
  ];

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-24 font-sans">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-celbrico-saffron to-celbrico-maroon pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden">
         <div className="absolute inset-0 bg-black/10"></div>
         <div className="relative z-10 flex items-center gap-4 text-white">
            <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-white flex items-center justify-center">
               <span className="text-4xl">👨🏽</span>
            </div>
            <div>
               <h1 className="text-2xl font-bold font-heading">Ravi Kumar</h1>
               <p className="text-white/80 text-sm mt-0.5">+91 98765 43210</p>
               <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold inline-flex items-center gap-1 mt-2">
                  <span>✨</span> CELBRICO PLUS MEMBER
               </div>
            </div>
         </div>
      </div>

      {/* Stats/Quick Links */}
      <div className="flex gap-4 px-4 -mt-4 relative z-20">
         <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-border text-center">
            <span className="text-2xl block mb-1">🪙</span>
            <span className="font-bold text-lg">2,450</span>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Reward Points</p>
         </div>
         <div className="flex-1 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-border text-center">
            <span className="text-2xl block mb-1">🎫</span>
            <span className="font-bold text-lg">3</span>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Active Coupons</p>
         </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-6 space-y-3">
         {menuItems.map((item, i) => (
            <motion.button 
               key={item.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               onClick={() => router.push(item.path)}
               className="w-full bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4 hover:bg-muted/50 transition-colors active:scale-[0.98]"
            >
               <div className="w-10 h-10 rounded-full bg-orange-50 text-primary flex items-center justify-center">
                  <item.icon size={20} />
               </div>
               <div className="flex-1 text-left">
                  <h3 className="font-bold text-sm text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
               </div>
               <ChevronRight size={18} className="text-muted-foreground" />
            </motion.button>
         ))}

         {/* Dark Mode Toggle Placeholder */}
         <div className="w-full bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4 mt-2">
             <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                <Moon size={20} />
             </div>
             <div className="flex-1 text-left">
                <h3 className="font-bold text-sm text-foreground">Dark Mode</h3>
             </div>
             <div className="w-10 h-6 bg-muted rounded-full border border-border relative">
                <div className="w-5 h-5 bg-white rounded-full border border-border shadow-sm absolute top-0.5 left-0.5" />
             </div>
         </div>

         {/* Logout */}
         <button className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
            <LogOut size={18} /> Logout
         </button>
      </div>

    </div>
  );
}
