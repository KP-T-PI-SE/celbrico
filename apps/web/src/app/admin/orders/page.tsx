"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Navigation,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    image?: string;
  }>;
  shippingDetails: {
    fullName: string;
    mobile: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    googleMapsUrl?: string;
  };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  statusHistory?: Array<{
    status: string;
    changedAt: string;
    changedBy?: string;
    note?: string;
  }>;
  whatsappStatus?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  // Status transition modal
  const [statusModalOrder, setStatusModalOrder] = useState<OrderDetail | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (activeStatus !== "all") params.status = activeStatus;
    if (searchTerm.trim()) params.search = searchTerm.trim();

    api
      .get("/admin/orders", { params })
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.data);
        }
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to load orders");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let isSubscribed = true;
    const params: Record<string, string> = {};
    if (activeStatus !== "all") params.status = activeStatus;
    if (searchTerm.trim()) params.search = searchTerm.trim();

    api
      .get("/admin/orders", { params })
      .then((res) => {
        if (isSubscribed && res.data.success) {
          setOrders(res.data.data);
        }
      })
      .catch((err: unknown) => {
        if (isSubscribed) {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || "Failed to load orders");
        }
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [activeStatus, searchTerm]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder || !newStatus) return;

    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/admin/orders/${statusModalOrder._id}/status`, {
        status: newStatus,
        note: statusNote.trim() || undefined,
      });

      if (res.data.success) {
        toast.success(`Order status changed to ${newStatus}`);
        setStatusModalOrder(null);
        setNewStatus("");
        setStatusNote("");
        loadOrders();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to transition status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusFilters = [
    { id: "all", label: "All Orders" },
    { id: "processing", label: "Processing" },
    { id: "confirmed", label: "Confirmed" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <main className="p-6 md:p-8 space-y-6 max-w-6xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Orders & Fulfillment</h1>
          <p className="text-xs text-slate-500">Track and advance order states across festive deliveries</p>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Controls: Search and Status Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search size={16} className="absolute inset-y-0 left-3.5 my-auto text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number (e.g. CEL-), customer name or phone..."
            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pt-1">
          {statusFilters.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStatus(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeStatus === s.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer & Phone</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-primary">{order.orderNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{order.shippingDetails?.fullName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">+91 {order.shippingDetails?.mobile}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <span className="font-medium text-slate-800">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </span>
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
                        {order.paymentStatus === "completed" ? "Paid Online" : "COD Pending"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize inline-flex items-center gap-1 ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {order.orderStatus === "delivered" && <CheckCircle2 size={11} />}
                        {order.orderStatus === "shipped" && <Truck size={11} />}
                        {order.orderStatus === "processing" && <Clock size={11} />}
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors"
                      >
                        Details
                      </button>

                      {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                        <button
                          onClick={() => {
                            setStatusModalOrder(order);
                            setNewStatus(
                              order.orderStatus === "processing"
                                ? "shipped"
                                : order.orderStatus === "shipped"
                                ? "delivered"
                                : "processing"
                            );
                          }}
                          className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-bold text-primary text-sm">{selectedOrder.orderNumber}</span>
                <p className="text-[10px] text-slate-400">Order Details & History</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-slate-900">Shipping & Delivery Address:</div>
              <p className="text-slate-700 font-semibold">{selectedOrder.shippingDetails.fullName}</p>
              <p className="text-slate-600">{selectedOrder.shippingDetails.street}</p>
              <p className="text-slate-600">
                {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state} -{" "}
                {selectedOrder.shippingDetails.pincode}
              </p>
              <p className="font-mono text-slate-700">Phone: +91 {selectedOrder.shippingDetails.mobile}</p>
              {selectedOrder.shippingDetails.googleMapsUrl && (
                <a
                  href={selectedOrder.shippingDetails.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-1 mt-1"
                >
                  <Navigation size={12} /> Open in Google Maps
                </a>
              )}
            </div>

            {/* Items List Snapshot */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">Purchased Items:</div>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <div className="text-[10px] text-slate-400">
                        {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.subtotal || item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status History */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Delivery Fee:</span>
                <span>{selectedOrder.deliveryFee === 0 ? "FREE" : `₹${selectedOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="text-primary">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Status History Timeline */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="text-xs font-bold text-slate-900">Status History Audit Log:</div>
                <div className="space-y-1.5">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="text-[11px] p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 capitalize">{h.status}</span>
                        {h.note && <span className="text-slate-500 ml-1.5">— {h.note}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(h.changedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-slate-900">Advance Order Status</h2>
              <button
                onClick={() => setStatusModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3.5">
              <div className="text-xs text-slate-600">
                Updating status for <span className="font-mono font-bold text-primary">{statusModalOrder.orderNumber}</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="processing">Processing (Packing)</option>
                  <option value="shipped">Shipped (Out for Delivery)</option>
                  <option value="delivered">Delivered (Completed)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Internal Audit Note (optional)</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched via express temple courier rider"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingStatus}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-glow transition-colors disabled:opacity-60 mt-2"
              >
                {isUpdatingStatus ? "Updating..." : "Confirm Status Transition"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
