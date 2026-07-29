'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function DaadiPage() {
  return (
    <div className="w-full min-h-screen bg-emerald-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-emerald-50/80 backdrop-blur-xl border-b border-emerald-100 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-100 transition-colors">
          <ChevronLeft size={20} className="text-emerald-900" />
        </Link>
        <div className="text-sm font-bold text-emerald-900">AI Daadi</div>
        <div className="w-8 h-8 flex items-center justify-center text-xl">👵🏽</div>
      </div>

      {/* Chat Area Placeholder */}
      <div className="px-4 py-6 max-w-2xl mx-auto flex flex-col gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-lg shrink-0">👵🏽</div>
          <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-emerald-100 max-w-[85%]">
            <p className="text-sm text-emerald-950 leading-relaxed">
              Namaste beta! I am your personal guide for all festivals. Are you preparing for Ganesh Chaturthi? I can help you with the shopping list, stories, or rituals!
            </p>
          </div>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 ml-11"
        >
          <button className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-200 transition-colors">
            What samagri do I need?
          </button>
          <button className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-200 transition-colors">
            Tell me a story about Ganesha
          </button>
          <button className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-200 transition-colors">
            How to do the sthapana?
          </button>
        </motion.div>

      </div>

      {/* Input Area */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 p-4 bg-emerald-50/90 backdrop-blur-md border-t border-emerald-100">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="flex-1 bg-white border border-emerald-200 rounded-full flex items-center px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <input 
              type="text" 
              placeholder="Ask Daadi anything..." 
              className="w-full text-sm bg-transparent border-none focus:outline-none"
            />
            <button className="p-2 -mr-2 text-muted-foreground hover:text-emerald-600 transition-colors">
              <Mic size={18} />
            </button>
          </div>
          <button className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md hover:bg-emerald-700 transition-colors shrink-0">
            <Send size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
