"use client";

import products from "@/data/products.json";
import ProductCard from "./ProductCard";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  badge?: string;
  slug: string;
  description?: string;
}

// ── Style A: 3-panel editorial (portrait) ──
function EditorialCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-stone-100 aspect-[2/3]">
      <Image src={product.image} alt={product.name} fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="33vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      {(product.badge || discount) && (
        <span className="absolute top-4 left-4 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white text-stone-900">
          {discount ? `-${discount}%` : product.badge}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {product.category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-1">{product.category}</p>
        )}
        <h3 className="text-white font-bold text-lg leading-snug mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-sm font-medium">${product.price.toFixed(2)}</span>
          <Link href={`/product/${product.slug}`}
            className="text-[11px] tracking-widest uppercase font-semibold bg-white text-stone-900 px-4 py-2 rounded-full hover:bg-stone-100 transition-colors">
            Shop
          </Link>
        </div>
        <button onClick={() => addToCart({ ...product, quantity: 1 })}
          className="w-full mt-2.5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/25 text-white text-[11px] tracking-widest uppercase font-semibold rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:bg-white hover:text-stone-900 hover:border-white active:scale-95">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ── Style B: 2-panel wide (landscape) ──
function WideCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/3] sm:aspect-[16/9]">
      <Image src={product.image} alt={product.name} fill
        className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
        sizes="50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {(product.badge || discount) && (
        <span className="absolute top-4 left-4 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white text-stone-900">
          {discount ? `-${discount}%` : product.badge}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {product.category && (
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 mb-1.5">{product.category}</p>
        )}
        <h3 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {product.name}
        </h3>
        <p className="text-white/70 text-sm mb-4">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-3">
          <Link href={`/product/${product.slug}`}
            className="text-[11px] tracking-widest uppercase font-semibold bg-white text-stone-900 px-6 py-2.5 rounded-full hover:bg-stone-900 hover:text-white border border-white transition-all duration-200">
            Shop Now
          </Link>
          <button onClick={() => addToCart({ ...product, quantity: 1 })}
            className="text-[11px] tracking-widest uppercase font-semibold bg-transparent text-white px-6 py-2.5 rounded-full border border-white/50 hover:bg-white hover:text-stone-900 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer">
            Quick Add
          </button>
        </div>
      </div>
    </div>
  );
}

// Items visible initially — 3 editorial + 8 regular = ~4 rows
const INITIAL_COUNT = 11;
const LOAD_MORE_COUNT = 16;

export default function ProductList() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const normalized = products.map((p) => ({
    ...p,
    originalPrice: p.originalPrice ?? undefined,
    badge: p.badge ?? undefined,
  }));

  const visible = normalized.slice(0, visibleCount);
  const hasMore = visibleCount < normalized.length;

  // First 3 → editorial
  const editorial = visible.slice(0, 3);
  // Next 8 → regular
  const regular1 = visible.slice(3, 11);
  // Banner divider shown after regular1 if we have more visible
  // Next 2 → wide cards (if loaded)
  const wide1 = visible.slice(11, 13);
  // Remaining → regular
  const rest = visible.slice(13);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100 px-1">
        <p className="text-[11px] text-stone-400 tracking-[0.18em] uppercase font-medium">
          {normalized.length} Products
        </p>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-stone-400 tracking-[0.18em] uppercase font-medium hidden sm:block">Sort by</span>
          <select className="text-[12px] border border-stone-200 rounded-lg px-3 py-1.5 text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* ── Row 1: 3 editorial ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {editorial.map((p) => <EditorialCard key={p.id} product={p} />)}
      </div>

      {/* ── Rows 2–3: 8 regular ── */}
      {regular1.length > 0 && (
        <div className="grid gap-x-5 gap-y-10 grid-cols-2 lg:grid-cols-4 mb-12">
          {regular1.map((p, i) => (
            <div key={p.id}
              className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: `${i * 35}ms`, animationFillMode: "both" }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* ── Full Width Banner (shows after first load more) ── */}
      {visibleCount > INITIAL_COUNT && (
        <div className="relative w-full overflow-hidden rounded-2xl mb-12" style={{ aspectRatio: "21/7" }}>
          <img
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop"
            alt="Forty Shoes Collection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/70 mb-2 font-medium">New Season</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Step Into the New
            </h2>
            <a href="/sale"
              className="text-[11px] tracking-widest uppercase font-semibold bg-white text-stone-900 px-6 py-2.5 rounded-full hover:bg-stone-900 hover:text-white border border-white transition-all duration-200">
              Shop Sale
            </a>
          </div>
        </div>
      )}

      {/* ── 2 wide cards ── */}
      {wide1.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {wide1.map((p) => <WideCard key={p.id} product={p} />)}
        </div>
      )}

      {/* ── Remaining regular ── */}
      {rest.length > 0 && (
        <div className="grid gap-x-5 gap-y-10 grid-cols-2 lg:grid-cols-4 mb-12">
          {rest.map((p, i) => (
            <div key={p.id}
              className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              style={{ animationDelay: `${i * 35}ms`, animationFillMode: "both" }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore ? (
        <div className="flex justify-center mt-4 mb-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            className="group flex items-center gap-2.5 border border-stone-900 text-stone-900 text-[11px] tracking-[0.18em] uppercase font-semibold px-10 py-3.5 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-200 cursor-pointer"
          >
            Load More
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      ) : (
        <p className="text-center text-[11px] tracking-widest uppercase text-stone-400 mb-12">
          All products loaded
        </p>
      )}
    </div>
  );
}