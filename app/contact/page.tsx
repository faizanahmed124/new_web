"use client";

import { useState } from "react";
import { Send, CheckCircle, Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Shield } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    { icon: Mail,  title: "Email Us",     lines: ["hello@fortyshoes.com", "support@fortyshoes.com"], sub: "Send us an email anytime" },
    { icon: Phone, title: "Call Us",       lines: ["+92 300 1234567", "+92 321 9876543"],             sub: "Mon–Sat, 9am – 6pm" },
    { icon: MapPin,title: "Visit Us",      lines: ["123 Fashion Street", "Lahore, Pakistan"],         sub: "Come say hello" },
    { icon: Clock, title: "Working Hours", lines: ["Mon – Fri: 9am – 6pm", "Saturday: 10am – 4pm"],  sub: "Sunday: Closed" },
  ];

  const features = [
    { icon: Headphones,    title: "24/7 Support",     desc: "Get help whenever you need it" },
    { icon: MessageSquare, title: "Quick Response",   desc: "We reply within 2 hours" },
    { icon: Shield,        title: "Secure & Private", desc: "Your information is safe with us" },
  ];

  const faqs = [
    { q: "What are your shipping policies?",  a: "We offer free shipping on orders over Rs. 3,000. Standard delivery takes 3–5 business days." },
    { q: "How can I track my order?",         a: "Once your order ships, you'll receive a tracking number via email or SMS." },
    { q: "What is your return policy?",       a: "We accept returns within 30 days of purchase. Items must be unworn and in original condition." },
    { q: "Do you offer nationwide delivery?", a: "Yes, we deliver all across Pakistan. International shipping is available on request." },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* Hero */}
      <section className="bg-stone-900 py-16 lg:py-20 text-center px-4">
        <p className="text-[11px] tracking-[0.28em] uppercase text-stone-400 font-medium mb-3">Get in Touch</p>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          We&apos;d Love to{" "}
          <em className="not-italic text-stone-300">Hear from You</em>
        </h1>
        <p className="text-stone-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Have a question about sizing, an order, or just want to say hello? We&apos;re here.
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-stone-900 mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Send Us a Message
            </h2>
            <p className="text-stone-400 text-sm mb-8">Fill out the form and we&apos;ll get back to you shortly.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: "name",  label: "Your Name",  type: "text",  placeholder: "Faizan Ahmed" },
                  { id: "email", label: "Your Email", type: "email", placeholder: "you@example.com" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">{label}</label>
                    <input
                      id={id} name={id} type={type} placeholder={placeholder}
                      value={(formData as any)[id]} onChange={handleChange} required
                      className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">Subject</label>
                <input
                  name="subject" type="text" placeholder="How can we help?"
                  value={formData.subject} onChange={handleChange} required
                  className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">Message</label>
                <textarea
                  name="message" rows={5} placeholder="Tell us more..."
                  value={formData.message} onChange={handleChange} required
                  className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all resize-none"
                />
              </div>

              <button
                type="submit" disabled={isSubmitting || isSubmitted}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-full text-[11px] tracking-widest uppercase font-bold transition-all duration-200 ${
                  isSubmitted ? "bg-green-700 text-white" : "bg-stone-900 hover:bg-stone-700 text-white disabled:opacity-60"
                }`}
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                ) : isSubmitted ? (
                  <><CheckCircle className="w-4 h-4" /> Message Sent!</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, title, lines, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800 tracking-wide mb-0.5">{title}</p>
                      {lines.map((l) => <p key={l} className="text-sm text-stone-500">{l}</p>)}
                      <p className="text-[11px] text-stone-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Why Contact Us?
              </h3>
              <div className="space-y-4">
                {features.map(({ icon: Icon, title, desc }, i) => (
                  <div key={title}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{title}</p>
                        <p className="text-xs text-stone-400">{desc}</p>
                      </div>
                    </div>
                    {i < features.length - 1 && <div className="border-t border-stone-100 mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.22em] uppercase text-stone-400 font-medium mb-2">FAQ</p>
          <h2 className="text-3xl font-bold text-stone-900 mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-stone-400 text-sm max-w-lg mx-auto">Quick answers to common questions.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl border border-stone-100 p-6 hover:border-stone-300 transition-colors shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 mb-2">{q}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-16 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Still Have Questions?
        </h2>
        <p className="text-stone-400 text-sm mb-8 max-w-md mx-auto">
          Our customer support team is always ready to help you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="tel:+923001234567"
            className="flex items-center gap-2 bg-white text-stone-900 text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-100 transition-colors">
            <Phone className="w-4 h-4" /> Call Us Now
          </a>
          <a href="mailto:hello@fortyshoes.com"
            className="flex items-center gap-2 text-white text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full border border-white/40 hover:bg-white/10 transition-colors">
            <Mail className="w-4 h-4" /> Email Us
          </a>
        </div>
      </section>
    </div>
  );
}