'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CalendarDays, UserCheck, Star } from 'lucide-react';
import Link from 'next/link';

export default function PanditPage() {
  const pandits = [
    { name: 'Pt. Sharma', rating: 4.9, reviews: 450, expertise: 'Ganesh Pooja, Satyanarayan', lang: 'Hindi, Marathi' },
    { name: 'Pt. Iyer', rating: 4.9, reviews: 320, expertise: 'Griha Pravesh, Havan', lang: 'Tamil, English, Hindi' },
    { name: 'Pt. Mishra', rating: 4.8, reviews: 210, expertise: 'Rudrabhishek, Navgraha', lang: 'Hindi, Sanskrit' },
  ];

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="text-sm font-bold text-foreground">Book a Pandit</div>
        <div className="w-8 h-8"></div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-100 rounded-3xl p-6 mb-8 text-center"
        >
          <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-2xl shadow-sm mb-4">🕉️</div>
          <h1 className="text-2xl font-heading font-bold text-orange-950 mb-2">Verified Expert Pandits</h1>
          <p className="text-sm text-orange-800/80 mb-6 max-w-xs mx-auto">Book experienced pandits for online video poojas or in-person ceremonies.</p>
          
          <div className="flex bg-white rounded-full p-1 border border-orange-100 shadow-sm relative">
            <div className="w-1/2 bg-primary text-white text-xs font-bold py-2.5 rounded-full text-center">Online (Video)</div>
            <div className="w-1/2 text-muted-foreground text-xs font-bold py-2.5 rounded-full text-center">Offline (In-person)</div>
          </div>
        </motion.div>

        {/* Date Selection Placeholder */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">Select Date</h2>
            <button className="text-xs text-primary font-semibold flex items-center gap-1"><CalendarDays size={14}/> Calendar</button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {[1, 2, 3, 4, 5, 6].map(day => (
              <div key={day} className={`min-w-[64px] h-20 rounded-2xl flex flex-col items-center justify-center border ${day === 1 ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'}`}>
                <span className="text-xs uppercase font-semibold mb-1">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][day-1]}</span>
                <span className="text-lg font-bold">{day + 10}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pandits List */}
        <div>
          <h2 className="font-bold text-foreground mb-4">Available Pandits</h2>
          <div className="flex flex-col gap-4">
            {pandits.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-4"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center shrink-0 text-xl shadow-inner">
                  🧑🏽‍🦲
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1">
                      {p.name} <UserCheck size={14} className="text-blue-500" />
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                      <Star size={10} className="fill-amber-500" /> {p.rating}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{p.expertise}</p>
                  <p className="text-[10px] text-foreground mb-3 font-medium">Speaks: {p.lang}</p>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">Book Now</button>
                    <button className="px-3 bg-muted text-foreground text-xs font-bold py-2 rounded-lg hover:bg-muted/80 transition-colors">Details</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
