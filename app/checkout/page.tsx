"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          total: Number(total.toFixed(2)),
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            image: item.image,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      setOrderNumber(data.orderNumber);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Order Placed!
          </h1>
          <p className="text-stone-500 mb-2">Thank you for your purchase.</p>
          <p className="text-stone-400 text-sm mb-2">
            Order ID: <span className="font-bold text-stone-700">{orderNumber}</span>
          </p>
          <p className="text-stone-400 text-sm mb-8">
            A confirmation will be sent to <span className="font-semibold">{form.email}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/customer/signin"
              className="bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors">
              Track My Order
            </Link>
            <Link href="/"
              className="border border-stone-300 text-stone-700 text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-50 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 mb-4">Your cart is empty.</p>
          <Link href="/" className="bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Back */}
        <Link href="/cart" className="flex items-center gap-2 text-stone-400 hover:text-stone-700 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-stone-900 mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Form ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Customer Info */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-stone-900 tracking-widest uppercase mb-5">
                  Customer Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name",     name: "name",    type: "text",  placeholder: "Faizan Ahmed", required: true },
                    { label: "Email Address", name: "email",   type: "email", placeholder: "you@example.com", required: true },
                    { label: "Phone Number",  name: "phone",   type: "tel",   placeholder: "+92 300 1234567", required: true },
                  ].map(({ label, name, type, placeholder, required }) => (
                    <div key={name} className={name === "email" ? "sm:col-span-2" : ""}>
                      <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">{label}</label>
                      <input type={type} name={name} placeholder={placeholder} required={required}
                        value={(form as any)[name]} onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-stone-900 tracking-widest uppercase mb-5">
                  Shipping Address
                </h2>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">Full Address</label>
                  <textarea name="address" placeholder="House #, Street, City, Province" required
                    value={form.address} onChange={handleChange} rows={3}
                    className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all resize-none" />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                ) : (
                  <>Place Order — ${total.toFixed(2)}</>
                )}
              </button>
            </form>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-stone-900 tracking-widest uppercase mb-5">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl bg-stone-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                      <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}