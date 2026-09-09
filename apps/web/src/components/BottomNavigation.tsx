"use client";

import { Home, Grid, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function BottomNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/categories", label: "Categories", icon: Grid },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: mounted && totalItems > 0 ? totalItems : undefined },
    { href: "/profile", label: "Account", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 py-3 bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-[0_-10px_40px_rgba(249,115,22,0.08)] rounded-t-3xl">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                isActive ? "text-primary" : "text-foreground/50 hover:text-primary"
              }`}
            >
              <div className="relative">
                <Icon size={22} className={isActive ? "stroke-[2.2]" : "stroke-[1.8]"} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
