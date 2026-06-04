"use client";

import { ArrowRight, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerSections = [
    {
      title: "Men",
      links: [
        { href: "/men", label: "All Men's" },
        { href: "/men/sneakers", label: "Sneakers" },
        { href: "/men/formal", label: "Formal" },
        { href: "/men/loafers", label: "Loafers" },
        { href: "/men/boots", label: "Boots" },
        { href: "/men/sandals", label: "Sandals" },
      ],
    },
    {
      title: "Women",
      links: [
        { href: "/women", label: "All Women's" },
        { href: "/women/heels", label: "Heels" },
        { href: "/women/flats", label: "Flats" },
        { href: "/women/sneakers", label: "Sneakers" },
        { href: "/women/boots", label: "Boots" },
        { href: "/women/sandals", label: "Sandals" },
      ],
    },
    {
      title: "Help",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/", label: "Shipping Info" },
        { href: "/", label: "Returns & Exchanges" },
        { href: "/", label: "Size Guide" },
        { href: "/", label: "FAQs" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/", label: "About Us" },
        { href: "/sale", label: "Sale" },
        { href: "/", label: "Careers" },
        { href: "/", label: "Privacy Policy" },
        { href: "/", label: "Terms & Conditions" },
      ],
    },
  ];

  const socialLinks = [
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300">

      {/* ── Newsletter band ── */}
      <div className="border-b border-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Stay in the loop
              </h3>
              <p className="text-stone-400 text-sm">
                New arrivals, exclusive offers and style drops — straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-1 focus:ring-white transition-all"
              />
              <button
                type="submit"
                className="bg-white text-stone-900 text-[11px] tracking-widest uppercase font-semibold px-5 py-3 rounded-full hover:bg-stone-100 transition-colors flex items-center gap-2 shrink-0"
              >
                {subscribed ? "Done ✓" : (
                  <>Subscribe <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col leading-none mb-6 group">
              <span
                className="text-2xl font-black tracking-[0.12em] text-white group-hover:text-stone-300 transition-colors"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                FORTY
              </span>
              <span className="text-[9px] tracking-[0.45em] text-stone-500 uppercase font-medium -mt-0.5">
                SHOES
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed mb-7 max-w-xs">
              Premium footwear for men and women. Comfort meets style in every pair we craft.
            </p>

            <div className="space-y-3 mb-7">
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <MapPin className="h-4 w-4 text-stone-500 shrink-0" />
                <span>123 Fashion Street, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <Phone className="h-4 w-4 text-stone-500 shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <Mail className="h-4 w-4 text-stone-500 shrink-0" />
                <span>hello@fortyshoes.com</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:border-white hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <span>© 2025 Forty Shoes. Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-stone-500">
            <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}