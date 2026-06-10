"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle, Truck, LogOut, ChevronRight } from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  total: number;
  items: OrderItem[];
}

const STATUS_CONFIG = {
  Pending:    { color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock,        step: 1 },
  Processing: { color: "bg-blue-50 text-blue-700 border-blue-200",      icon: Package,      step: 2 },
  Shipped:    { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck,        step: 3 },
  Delivered:  { color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle,  step: 4 },
};

const DEMO_ORDERS: Record<string, Order[]> = {
  "ali@example.com": [
    {
      id: "FS-20240101",
      date: "Jan 01, 2025",
      status: "Delivered",
      total: 268,
      items: [
        { name: "AirFlex Runner",  qty: 1, price: 89,  image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=200" },
        { name: "Volt Edge",       qty: 1, price: 119, image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=200" },
        { name: "Street Vibe Low", qty: 1, price: 69,  image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=200" },
      ],
    },
    {
      id: "FS-20240215",
      date: "Feb 15, 2025",
      status: "Shipped",
      total: 184,
      items: [
        { name: "Nova Horizon", qty: 1, price: 109, image: "https://images.unsplash.com/photo-1516767254874-281bffac9e9a?q=80&w=200" },
        { name: "AeroFlex Lite", qty: 1, price: 75, image: "https://images.unsplash.com/photo-1496202703211-aa28e9500c30?q=80&w=200" },
      ],
    },
    {
      id: "FS-20240310",
      date: "Mar 10, 2025",
      status: "Pending",
      total: 99,
      items: [
        { name: "Pulse React", qty: 1, price: 99, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=200" },
      ],
    },
  ],
  "sara@example.com": [
    {
      id: "FS-20240120",
      date: "Jan 20, 2025",
      status: "Delivered",
      total: 197,
      items: [
        { name: "Rose Stride",  qty: 1, price: 89,  image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=200" },
        { name: "Blossom Ballet Flat", qty: 1, price: 58, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200" },
        { name: "Sunrise Slide", qty: 1, price: 42, image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?q=80&w=200" },
      ],
    },
    {
      id: "FS-20240305",
      date: "Mar 05, 2025",
      status: "Processing",
      total: 203,
      items: [
        { name: "Luxe Walk",    qty: 1, price: 125, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=200" },
        { name: "Noir Mule",    qty: 1, price: 85,  image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=200" },
      ],
    },
  ],
  "ahmed@example.com": [
    {
      id: "FS-20240208",
      date: "Feb 08, 2025",
      status: "Delivered",
      total: 324,
      items: [
        { name: "Zenith Flow",     qty: 1, price: 129, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=200" },
        { name: "Carbon Pace",     qty: 1, price: 149, image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=200" },
        { name: "Classic Court 90s", qty: 1, price: 79, image: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?q=80&w=200" },
      ],
    },
    {
      id: "FS-20240401",
      date: "Apr 01, 2025",
      status: "Shipped",
      total: 139,
      items: [
        { name: "Summit High", qty: 1, price: 139, image: "https://images.unsplash.com/photo-1496202703211-aa28e9500c30?q=80&w=200" },
      ],
    },
  ],
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [orders, setOrders]   = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("customer_logged_in");
    if (!loggedIn) { router.push("/customer/signin"); return; }
    const n = sessionStorage.getItem("customer_name") || "";
    const e = sessionStorage.getItem("customer_email") || "";
    setName(n);
    setEmail(e);
    setOrders(DEMO_ORDERS[e] || []);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("customer_logged_in");
    sessionStorage.removeItem("customer_name");
    sessionStorage.removeItem("customer_email");
    router.push("/customer/signin");
  };

  const stats = {
    total:     orders.length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    active:    orders.filter((o) => o.status !== "Delivered").length,
    spent:     orders.reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex flex-col leading-none group">
            <span className="text-xl font-black tracking-[0.12em] text-stone-900"
              style={{ fontFamily: "'Georgia', serif" }}>FORTY</span>
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
          <h1 className="text-3xl font-black text-stone-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Welcome, {name.split(" ")[0]}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders",   val: stats.total },
            { label: "Delivered",      val: stats.delivered },
            { label: "Active Orders",  val: stats.active },
            { label: "Total Spent",    val: `$${stats.spent}` },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-100 p-4 text-center">
              <p className="text-2xl font-bold text-stone-900">{val}</p>
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <h2 className="text-[11px] tracking-[0.18em] uppercase text-stone-400 font-semibold mb-4">My Orders</h2>

        {orders.length === 0 ? (
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
              const cfg = STATUS_CONFIG[order.status];
              const Icon = cfg.icon;
              const isOpen = expanded === order.id;

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">

                  {/* Order header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors text-left"
                  >
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

                  {/* Progress bar */}
                  <div className="px-5 pb-3">
                    <div className="flex items-center gap-1">
                      {["Pending", "Processing", "Shipped", "Delivered"].map((s, i) => (
                        <div key={s} className="flex items-center gap-1 flex-1">
                          <div className={`h-1 flex-1 rounded-full transition-all ${
                            i < cfg.step ? "bg-stone-900" : "bg-stone-100"
                          }`} />
                          {i === 3 && <div className={`w-2 h-2 rounded-full ${cfg.step === 4 ? "bg-stone-900" : "bg-stone-100"}`} />}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      {["Pending", "Processing", "Shipped", "Delivered"].map((s, i) => (
                        <span key={s} className={`text-[9px] tracking-wide ${i < cfg.step ? "text-stone-700 font-semibold" : "text-stone-300"}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded items */}
                  {isOpen && (
                    <div className="border-t border-stone-100 p-5 space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img src={item.image} alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl bg-stone-100 shrink-0" />
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
          <Link href="/"
            className="inline-flex items-center gap-2 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}