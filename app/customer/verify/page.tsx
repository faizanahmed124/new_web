"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, RefreshCw } from "lucide-react";

export default function VerifyOTPPage() {
  const router  = useRouter();
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]         = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const e = sessionStorage.getItem("otp_email");
    if (!e) { router.push("/customer/signin"); return; }
    setEmail(e);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    // Auto focus next
    if (value && index < 5) inputs.current[index + 1]?.focus();
    // Auto submit when all filled
    if (newOtp.every((d) => d) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      handleVerify(paste);
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) { setError("Please enter the complete 6-digit code."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Success — save session
      sessionStorage.setItem("customer_logged_in", "true");
      sessionStorage.setItem("customer_email", email);
      sessionStorage.setItem("customer_name", email.split("@")[0]);
      router.push("/customer/orders");
    } catch (err: any) {
      setError(err.message || "Invalid code. Please try again.");
      setLoading(false);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setCountdown(60);
      setCanResend(false);
      inputs.current[0]?.focus();
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col leading-none group">
            <span className="text-3xl font-black tracking-[0.12em] text-stone-900 group-hover:text-stone-600 transition-colors"
              style={{ fontFamily: "'Georgia', serif" }}>FORTY</span>
            <span className="text-[9px] tracking-[0.45em] text-stone-400 uppercase font-medium -mt-0.5">SHOES</span>
          </Link>
          <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-medium mt-3">Verify Email</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Check Your Email
          </h1>
          <p className="text-stone-400 text-sm mb-1 text-center">
            We sent a 6-digit code to
          </p>
          <p className="text-stone-900 text-sm font-bold text-center mb-8">{email}</p>

          {/* OTP Input boxes */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none ${
                  error
                    ? "border-red-300 bg-red-50 text-red-600"
                    : digit
                    ? "border-stone-900 bg-stone-50 text-stone-900"
                    : "border-stone-200 bg-stone-50 text-stone-900 focus:border-stone-900"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4 text-center">
              {error}
            </p>
          )}

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.join("").length !== 6}
            className="w-full py-3.5 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-5"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            ) : "Verify & Sign In"}
          </button>

          {/* Resend */}
          <div className="text-center">
            {canResend ? (
              <button onClick={handleResend} disabled={resending}
                className="flex items-center gap-1.5 text-sm text-stone-900 font-semibold hover:underline underline-offset-4 transition-colors mx-auto disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Sending..." : "Resend Code"}
              </button>
            ) : (
              <p className="text-sm text-stone-400">
                Resend code in <span className="font-bold text-stone-700">{countdown}s</span>
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-6 flex items-center justify-center gap-4">
          <button onClick={() => router.push("/customer/signin")}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            ← Change Email
          </button>
          <span className="text-stone-200">|</span>
          <Link href="/" className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}