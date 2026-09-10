"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ArrowLeft,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useIsMounted } from "@/lib/useIsMounted";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-sm font-medium text-slate-500">
          Checking administrator authorization...
        </div>
      </div>
    );
  }

  // Allow the login page itself to render without guard block
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Authorization Guard: Reject non-admins
  if (!token || user?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>
        <h1 className="font-serif text-2xl font-bold">Admin Privileges Required</h1>
        <p className="text-xs text-slate-400 max-w-sm">
          Access to the Celbrico Admin Portal is strictly restricted to authorized staff and administrators.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Return to Store
          </Link>
          <Link
            href="/admin/login"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-glow transition-colors"
          >
            Admin Sign In
          </Link>
        </div>
      </main>
    );
  }

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingBag },
    { href: "/admin/products", label: "Products & Stock", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-gold flex items-center justify-center text-white font-serif font-bold text-lg shadow-glow">
                🪔
              </div>
              <div>
                <span className="font-serif font-bold text-base text-slate-900 tracking-tight block leading-tight">
                  Celbrico
                </span>
                <span className="text-[9px] font-bold text-primary tracking-widest uppercase block">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & exit */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user.name || `+91 ${user.mobileNumber}`}
              </p>
              <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Verified Admin
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={13} /> Storefront
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold rounded-lg flex items-center justify-center transition-colors"
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
