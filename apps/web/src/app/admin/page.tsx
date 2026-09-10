"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";

interface MetricsData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  activeProducts: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    shippingDetails: {
      fullName: string;
      mobile: string;
    };
  }>;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get("/admin/metrics");
        if (res.data.success) {
          setMetrics(res.data.data);
        }
      } catch (err) {
        console.error("Failed fetching admin metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-6xl w-full">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500">Live operational metrics and store performance</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-glow flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {loading ? "..." : `₹${(metrics?.totalRevenue || 0).toLocaleString("en-IN")}`}
          </div>
          <p className="text-[10px] text-emerald-600 font-medium">Verified online & completed transactions</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {loading ? "..." : metrics?.totalOrders || 0}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">All festival orders received</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-amber-600">
            {loading ? "..." : metrics?.pendingOrders || 0}
          </div>
          <p className="text-[10px] text-amber-600 font-medium">Processing or awaiting dispatch</p>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">
            {loading ? "..." : metrics?.activeProducts || 0}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Products available on storefront</p>
        </div>
      </div>

      {/* Secondary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{metrics?.completedOrders || 0}</div>
            <div className="text-[11px] text-slate-500">Delivered Orders</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <XCircle size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{metrics?.cancelledOrders || 0}</div>
            <div className="text-[11px] text-slate-500">Cancelled Orders</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{metrics?.totalCustomers || 0}</div>
            <div className="text-[11px] text-slate-500">Registered Customers</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-base text-slate-900">Recent Customer Orders</h2>
            <p className="text-[11px] text-slate-500">Latest orders placed across festival categories</p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Manage All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order No</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Loading recent orders...
                  </td>
                </tr>
              ) : !metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{order.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{order.shippingDetails?.fullName || "Guest"}</div>
                      <div className="text-[10px] text-slate-400">+91 {order.shippingDetails?.mobile}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-serif">₹{order.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.paymentStatus === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders?search=${order.orderNumber}`}
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
