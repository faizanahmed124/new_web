"use client";

import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col leading-none mb-3">
            <span className="text-3xl font-black tracking-[0.12em] text-stone-900"
              style={{ fontFamily: "'Georgia', serif" }}>FORTY</span>
            <span className="text-[9px] tracking-[0.45em] text-stone-400 uppercase font-medium -mt-0.5">SHOES</span>
          </div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-medium">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <h1 className="text-xl font-bold text-stone-900 mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Sign in
          </h1>
          <p className="text-stone-400 text-sm mb-7">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-600 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all bg-stone-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all bg-stone-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[11px] text-stone-400 mt-6">
            Default: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">admin</code> / <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">forty2025</code>
          </p>
        </div>
      </div>
    </div>
  );
}