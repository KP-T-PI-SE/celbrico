"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 backdrop-blur-md bg-card/90 border-b border-orange-100/30">
      <div className="flex items-center justify-between mb-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-primary to-gold flex items-center justify-center text-white font-serif font-bold shadow-glow text-lg">
            🪔
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl text-primary font-bold leading-none tracking-tight">Celbrico</h1>
            <span className="text-[9px] text-foreground/60 tracking-wider uppercase mt-0.5">Every Festival, Delivered.</span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full bg-white shadow-sm border border-orange-100 text-foreground/80 hover:text-primary transition-colors flex items-center justify-center"
            aria-label="View Cart"
          >
            <ShoppingBag size={20} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-foreground/40">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white py-2.5 pl-10 pr-12 rounded-full shadow-sm border border-orange-100/60 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium placeholder:text-foreground/40"
          placeholder="Search pooja kits, samagri, flowers..."
        />
        <div className="absolute inset-y-0 right-1 flex items-center">
          <button
            type="submit"
            aria-label="Search"
            className="p-2 bg-linear-to-r from-primary to-primary-light text-white rounded-full shadow-glow hover:opacity-95 transition-opacity"
          >
            <Search size={15} />
          </button>
        </div>
      </form>
    </header>
  );
}
