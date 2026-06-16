"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle, Truck, LogOut, ChevronRight, XCircle } from "lucide-react";

interface OrderItem { name: string; qty: number; price: number; image: string; }
interface Order {
  id: string; date: string; status: string; total: number; items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { color: string; icon: any; step: number }> = {
  Pending:    { color: "bg-amber-50 text-amber-700 border-amber-200",    icon: Clock,       step: 1 },
  Processing: { color: "bg-blue-50 text-blue-700 border-blue-200",       icon: Package,     step: 2 },
  Shipped:    { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck,       step: 3 },
  Delivered:  { color: "bg-green-50 text-green-700 border-green-200",    icon: CheckCircle, step: 4 },
  Cancelled:  { color: "bg-red-50 text-red-700 border-red-200",          icon: XCircle,     step: 0 },
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("customer_logged_in");
    if (!loggedIn) { router.push("/customer/signin"); return; }
    const n = sessionStorage.getItem("customer_name") || "";
    const e = sessionStorage.getItem("customer_email") || "";
    setName(n);
    setEmail(e);
    fetchOrders(e);
  }, []);

  const fetchOrders = async (customerEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(customerEmail)}`);
      const data = await res.json();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("customer_logged_in");
    sessionStorage.removeItem("customer_name");
    sessionStorage.removeItem("customer_email");
    router.push("/customer/signin");
  };

  const stats = {
    total:     orders.length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    active:    orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length,
    spent:     orders.reduce((s, o) => s + Number(o.total), 0),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex flex-col leading-none group">
            <span className="text-xl font-black tracking-[0.12em] text-stone-900" style={{ fontFamily: "'Georgia', serif" }}>FORTY</span>
            <span className="text-[8px] tracking-[0.45em] text-stone-400 uppercase -mt-0.5">SHOES</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-900">{name}</p>
              <p className="text-xs text-stone-400">{email}</p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-[11px] tracking-wide text-stone-500 hover:text-red-600 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-stone-400 font-medium mb-1">My Account</p>
          <h1 className="text-3xl font-black text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Welcome, {name.split(" ")[0] || name.split("@")[0]}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders",  val: stats.total },
            { label: "Delivered",     val: stats.delivered },
            { label: "Active Orders", val: stats.active },
            { label: "Total Spent",   val: `$${stats.spent}` },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-100 p-4 text-center">
              <p className="text-2xl font-bold text-stone-900">{val}</p>
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <h2 className="text-[11px] tracking-[0.18em] uppercase text-stone-400 font-semibold mb-4">My Orders</h2>

        {loading ? (
          <p className="text-center text-stone-400 py-12">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No orders yet</p>
            <Link href="/" className="mt-4 inline-block text-[11px] tracking-widest uppercase font-bold text-stone-900 underline underline-offset-4">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
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
                        <p className="text-xs text-stone-400">{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
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

                  {/* Progress bar (hidden if cancelled) */}
                  {order.status !== "Cancelled" && (
                    <div className="px-5 pb-3">
                      <div className="flex items-center gap-1">
                        {["Pending", "Processing", "Shipped", "Delivered"].map((s, i) => (
                          <div key={s} className="flex items-center gap-1 flex-1">
                            <div className={`h-1 flex-1 rounded-full transition-all ${i < cfg.step ? "bg-stone-900" : "bg-stone-100"}`} />
                            {i === 3 && <div className={`w-2 h-2 rounded-full ${cfg.step === 4 ? "bg-stone-900" : "bg-stone-100"}`} />}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        {["Pending", "Processing", "Shipped", "Delivered"].map((s, i) => (
                          <span key={s} className={`text-[9px] tracking-wide ${i < cfg.step ? "text-stone-700 font-semibold" : "text-stone-300"}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isOpen && (
                    <div className="border-t border-stone-100 p-5 space-y-3">
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
                      <div className="border-t border-stone-100 pt-3 flex justify-between">
                        <span className="text-sm text-stone-500">Order Total</span>
                        <span className="text-sm font-bold text-stone-900">${order.total}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}