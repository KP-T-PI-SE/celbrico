"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw, Smartphone, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface Customer {
  id: string;
  mobileNumber: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCustomers = () => {
    setLoading(true);
    api
      .get("/admin/customers")
      .then((res) => {
        if (res.data.success) {
          setCustomers(res.data.data);
        }
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to load customers");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isSubscribed = true;
    api
      .get("/admin/customers")
      .then((res) => {
        if (isSubscribed && res.data.success) {
          setCustomers(res.data.data);
        }
      })
      .catch((err: unknown) => {
        if (isSubscribed) {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || "Failed to load customers");
        }
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.mobileNumber.includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-6xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Customer Directory</h1>
          <p className="text-xs text-slate-500">Registered festival shoppers, order volumes, and lifetime spend</p>
        </div>

        <button
          onClick={loadCustomers}
          className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search size={16} className="absolute inset-y-0 left-3.5 my-auto text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer phone number, name, or email..."
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-primary/20 to-gold/20 text-primary font-bold flex items-center justify-center text-xs">
                        {c.name ? c.name.charAt(0).toUpperCase() : c.mobileNumber.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{c.name || "Customer"}</div>
                        <div className="text-[10px] text-slate-400">{c.email || "No email provided"}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                        <Smartphone size={12} className="text-slate-400" />
                        +91 {c.mobileNumber}
                      </div>
                      {c.isVerified && (
                        <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-sm">
                          Verified
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-[11px]">
                        {c.orderCount} order{c.orderCount === 1 ? "" : "s"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-serif font-bold text-slate-900 text-sm">
                      ₹{c.totalSpent.toLocaleString("en-IN")}
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
