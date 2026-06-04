"use client";

import { useCart } from "@/context/CartContext";
import products from "@/data/products.json";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Truck, RotateCcw, Shield } from "lucide-react";

const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const paramValue = params.productId as string;
  const product = products.find(
    (p) => p.slug === paramValue || String(p.id) === paramValue
  );

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-stone-400 text-sm">Product not found.</p>
        <Link href="/" className="text-sm font-semibold text-stone-900 underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-[11px] text-stone-400 tracking-wide">
          <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${product.category?.toLowerCase()}`} className="hover:text-stone-700 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Left: Image */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 lg:sticky lg:top-24">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {(product.badge || discount) && (
                <span className="absolute top-5 left-5 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-white text-stone-900 shadow-sm">
                  {discount ? `-${discount}%` : product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:pt-4">
            {product.category && (
              <p className="text-[11px] tracking-[0.22em] uppercase text-stone-400 font-medium mb-2">
                {product.category}
              </p>
            )}
            <h1
              className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center flex-wrap gap-3 mb-6">
              <span className="text-2xl font-bold text-stone-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-stone-400 line-through">${(product.originalPrice as number).toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-white bg-stone-900 px-2.5 py-1 rounded-full tracking-wider uppercase">{discount}% OFF</span>
                </>
              )}
              <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                + Free Shipping
              </span>
            </div>

            <p className="text-stone-500 text-sm leading-relaxed mb-8 pb-8 border-b border-stone-100">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-stone-900">
                  Select Size
                  {selectedSize && <span className="ml-2 text-stone-500 normal-case tracking-normal font-normal text-xs">— UK {selectedSize}</span>}
                </p>
                <button className="text-[11px] text-stone-400 hover:text-stone-700 underline underline-offset-4 transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`py-3 text-sm font-medium rounded-xl border transition-all duration-150 ${
                      selectedSize === size
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-900 hover:text-stone-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-red-500 text-xs mt-2.5 font-medium">Please select a size before adding to cart.</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-full text-sm font-bold tracking-[0.15em] uppercase transition-all duration-200 mb-4 ${
                added
                  ? "bg-green-700 text-white"
                  : selectedSize
                  ? "bg-stone-900 hover:bg-stone-700 text-white"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              {added ? "Added to Cart ✓" : selectedSize ? "Add to Cart" : "Select a Size"}
            </button>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-7 border-t border-stone-100">
              {[
                { icon: Truck,     label: "Free Shipping",  sub: "Orders over Rs. 3,000" },
                { icon: RotateCcw, label: "Easy Returns",   sub: "30-day return policy"  },
                { icon: Shield,    label: "100% Authentic", sub: "Genuine products only" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-stone-500" />
                  </div>
                  <p className="text-[11px] font-semibold text-stone-800 tracking-wide leading-tight">{label}</p>
                  <p className="text-[10px] text-stone-400 leading-tight">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-8 h-px bg-stone-300" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-stone-400 font-medium">You May Also Like</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              More from {product.category}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="relative aspect-square bg-stone-100 rounded-xl overflow-hidden mb-3">
                    <Image src={p.image} alt={p.name} fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      sizes="25vw" />
                  </div>
                  <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-0.5">{p.category}</p>
                  <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-500 transition-colors line-clamp-1 mb-1">{p.name}</h3>
                  <p className="text-sm font-bold text-stone-900">${p.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}