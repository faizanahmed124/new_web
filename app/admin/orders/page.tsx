"use client";

import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Package, Clock, Truck, CheckCircle, XCircle, ChevronRight } from "lucide-react";

interface OrderItem { name: string; qty: number; price: number; image: string; }
interface Order {
  id: string; dbId: number; date: string; status: string;
  total: number; email: string; name: string; phone: string; address: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  Pending:    { color: "bg-amber-50 text-amber-700 border-amber-200",    icon: Clock },
  Processing: { color: "bg-blue-50 text-blue-700 border-blue-200",       icon: Package },
  Shipped:    { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
  Delivered:  { color: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle },
  Cancelled:  { color: "bg-red-50 text-red-700 border-red-200",          icon: XCircle },
};

export default function AdminOrdersPage() {
  const { isLoggedIn, logout } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { router.push("/admin/signin"); return; }
    fetchOrders();
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (dbId: number, status: string) => {
    setOrders((prev) => prev.map((o) => o.dbId === dbId ? { ...o, status } : o));
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dbId, status }),
    });
  };

  const filtered = filterStatus === "All" ? orders : orders.filter((o) => o.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    revenue: orders.reduce((s, o) => s + Number(o.total), 0),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-[0.12em] text-stone-900" style={{ fontFamily: "'Georgia', serif" }}>FORTY</span>
            <span className="text-[8px] tracking-[0.45em] text-stone-400 uppercase -mt-0.5">SHOES</span>
          </div>
          <span className="text-stone-300 text-lg">|</span>
          <span className="text-[11px] tracking-[0.18em] uppercase text-stone-500 font-semibold">Orders</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/admin/dashboard" className="text-[11px] tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
            Products
          </a>
          <a href="/" className="text-[11px] tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
            ← View Site
          </a>
          <button onClick={() => { logout(); router.push("/admin/signin"); }}
            className="flex items-center gap-1.5 text-[11px] tracking-wide text-stone-500 hover:text-red-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Orders", val: stats.total },
            { label: "Pending", val: stats.pending },
            { label: "Total Revenue", val: `$${stats.revenue}` },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-100 p-4 text-center">
              <p className="text-2xl font-bold text-stone-900">{val}</p>
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-[11px] tracking-widest uppercase font-semibold px-4 py-2 rounded-full border transition-all ${
                filterStatus === s ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-400"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <p className="text-center text-stone-400 py-12">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
              const Icon = cfg.icon;
              const isOpen = expanded === order.id;

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
                  <button onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-stone-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{order.id}</p>
                        <p className="text-xs text-stone-400">{order.date} · {order.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-stone-900">${order.total}</span>
                      <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-stone-100 p-5">
                      {/* Customer info */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-5 text-sm">
                        <div><span className="text-stone-400">Name:</span> <span className="text-stone-900 font-medium">{order.name || "—"}</span></div>
                        <div><span className="text-stone-400">Email:</span> <span className="text-stone-900 font-medium">{order.email}</span></div>
                        <div><span className="text-stone-400">Phone:</span> <span className="text-stone-900 font-medium">{order.phone || "—"}</span></div>
                        <div><span className="text-stone-400">Address:</span> <span className="text-stone-900 font-medium">{order.address || "—"}</span></div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 mb-5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl bg-stone-100 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                              <p className="text-xs text-stone-400">Qty: {item.qty}</p>
                            </div>
                            <p className="text-sm font-bold text-stone-900">${item.price}</p>
                          </div>
                        ))}
                      </div>

                      {/* Status update */}
                      <div className="border-t border-stone-100 pt-4 flex items-center justify-between flex-wrap gap-3">
                        <span className="text-sm text-stone-500">Update Status</span>
                        <div className="flex gap-2 flex-wrap">
                          {STATUS_OPTIONS.map((s) => (
                            <button key={s} onClick={() => updateStatus(order.dbId, s)}
                              className={`text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 rounded-full border transition-all ${
                                order.status === s
                                  ? "bg-stone-900 text-white border-stone-900"
                                  : "border-stone-200 text-stone-600 hover:border-stone-400"
                              }`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}