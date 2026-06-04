"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image block */}
      <div className="relative w-full aspect-square bg-stone-100 rounded-xl overflow-hidden mb-3">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {(product.badge || discount) && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white text-stone-900 shadow-sm pointer-events-none">
            {discount ? `-${discount}%` : product.badge}
          </span>
        )}

        {/* Add to Cart button — slides up on hover */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 text-[11px] tracking-[0.12em] uppercase font-semibold py-3 rounded-full shadow-lg transition-all duration-200 ${
              added
                ? "bg-stone-700 text-white"
                : "bg-stone-900 text-white hover:bg-stone-700"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        {product.category && (
          <p className="text-[10px] tracking-[0.18em] uppercase text-stone-400 font-medium mb-0.5">
            {product.category}
          </p>
        )}

        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="shrink-0 text-right">
            <span className="text-sm font-semibold text-stone-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="block text-xs text-stone-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}