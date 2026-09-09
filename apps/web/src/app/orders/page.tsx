"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface OrderItem {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders/my-orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Failed fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="min-h-screen bg-background pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md px-4 py-3.5 border-b border-orange-100/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-full bg-white border border-orange-100 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">My Orders</h1>
            <p className="text-[10px] text-foreground/60">Track your festival delivery history</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/70 rounded-3xl animate-pulse border border-orange-100/50" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🛍️
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">No Orders Placed Yet</h2>
              <p className="text-xs text-foreground/60 max-w-xs mx-auto mt-1">
                You haven&apos;t placed any festival orders yet. Explore our temple-grade pooja kits and festive samagri.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-primary-light text-white font-medium text-xs rounded-full shadow-glow"
            >
              <ShoppingBag size={15} /> Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order.orderNumber}/confirmation`}
              className="block bg-white rounded-3xl p-4 border border-orange-100/60 shadow-glass hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-orange-50">
                <div>
                  <span className="font-mono text-xs font-bold text-primary">{order.orderNumber}</span>
                  <div className="text-[10px] text-foreground/50 flex items-center gap-1 mt-0.5">
                    <Clock size={11} /> {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.paymentStatus === 'completed' ? 'Paid Online' : 'Pay on Delivery'}
                  </span>
                </div>
              </div>

              <div className="py-3 text-xs space-y-1">
                <div className="font-semibold text-foreground/90 line-clamp-1">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </div>
                <div className="text-[11px] text-foreground/60">
                  {order.items.length} item{order.items.length === 1 ? '' : 's'} in this order
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-orange-50 text-xs font-bold">
                <div className="text-foreground">
                  Total: <span className="text-primary font-serif text-sm">₹{order.totalAmount}</span>
                </div>
                <div className="text-primary flex items-center gap-1 text-[11px] group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}
