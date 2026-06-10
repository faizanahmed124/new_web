"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function CustomerSignInPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      // Save email for verify page
      sessionStorage.setItem("otp_email", email);
      router.push("/customer/verify");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col leading-none group">
            <span className="text-3xl font-black tracking-[0.12em] text-stone-900 group-hover:text-stone-600 transition-colors"
              style={{ fontFamily: "'Georgia', serif" }}>
              FORTY
            </span>
            <span className="text-[9px] tracking-[0.45em] text-stone-400 uppercase font-medium -mt-0.5">SHOES</span>
          </Link>
          <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-medium mt-3">My Account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-stone-700" />
          </div>

          <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Sign In
          </h1>
          <p className="text-stone-400 text-sm mb-8 text-center leading-relaxed">
            Enter your email address and we&apos;ll send you a one-time code to sign in.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending Code...</>
              ) : (
                <>Send Code <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <p className="text-[11px] text-stone-500 leading-relaxed text-center">
              A 6-digit verification code will be sent to your email. Valid for <strong className="text-stone-700">10 minutes</strong>.
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            ← Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}