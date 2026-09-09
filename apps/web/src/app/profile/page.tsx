"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { 
  UserCircle, LogOut, MapPin, CreditCard, 
  Wallet, Gift, HelpCircle, Info, Shield, Trash2, 
  ChevronRight, Sparkles, ShoppingBag
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
};

type MenuGroup = {
  group: string;
  items: MenuItem[];
};

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const menuItems: MenuGroup[] = [
    {
      group: "Preferences",
      items: [
        { title: "Festival Preferences", icon: <Sparkles size={20} />, href: "/profile/festivals", color: "text-primary" },
        { title: "Language", icon: <GlobeIcon size={20} />, href: "/profile/language", color: "text-blue-500" }
      ]
    },
    {
      group: "Account",
      items: [
        { title: "My Orders", icon: <ShoppingBag size={20} />, href: "/orders", color: "text-orange-500" },
        { title: "Saved Addresses", icon: <MapPin size={20} />, href: "/addresses", color: "text-green-500" },
        { title: "Payment Methods", icon: <CreditCard size={20} />, href: "/payments", color: "text-purple-500" }
      ]
    },
    {
      group: "Rewards & Wallet",
      items: [
        { title: "My Wallet", icon: <Wallet size={20} />, href: "/wallet", color: "text-emerald-500", badge: "₹500" },
        { title: "Rewards & Points", icon: <Gift size={20} />, href: "/rewards", color: "text-rose-500", badge: "250 pts" }
      ]
    },
    {
      group: "Support & Legal",
      items: [
        { title: "Help & Support", icon: <HelpCircle size={20} />, href: "/support", color: "text-cyan-500" },
        { title: "About Celbrico", icon: <Info size={20} />, href: "/about", color: "text-slate-500" },
        { title: "Privacy Policy", icon: <Shield size={20} />, href: "/privacy", color: "text-slate-500" }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-linear-to-b from-primary/10 to-transparent pt-12 pb-6 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/mandala-bg.svg')] bg-no-repeat bg-cover bg-top opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground">My Profile</h1>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-orange-50 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors">
            <UserCircle size={24} />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-glass border border-orange-50 relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
            {user ? user.mobileNumber.substring(0, 1) : "U"}
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">
              {user ? `+91 ${user.mobileNumber}` : "Guest User"}
            </h2>
            <p className="text-xs text-foreground/60 flex items-center gap-1 mt-1">
              <Sparkles size={12} className="text-primary" /> Celbrico Member
            </p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-6 space-y-8 mt-2">
        {menuItems.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3 ml-2">
              {group.group}
            </h3>
            <div className="bg-white rounded-3xl shadow-sm border border-orange-100/30 overflow-hidden divide-y divide-orange-50">
              {group.items.map((item, itemIdx) => (
                <Link key={itemIdx} href={item.href} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-foreground/90">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="bg-red-50/50 rounded-3xl p-4 border border-red-100 flex flex-col gap-2 mt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between p-3 text-red-600 hover:bg-red-100/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3 font-medium">
              <LogOut size={20} /> Logout
            </div>
          </button>
          <button 
            className="flex items-center justify-between p-3 text-red-400 hover:bg-red-100/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3 font-medium text-sm">
              <Trash2 size={18} /> Delete Account
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}

interface GlobeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Temporary icon component for Globe
function GlobeIcon(props: GlobeIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}
