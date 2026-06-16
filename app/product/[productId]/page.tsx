"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/home/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  badge?: string | null;
  slug: string;
  description?: string;
}

const SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data : []);
        const found = data.find(
          (p) => p.slug === productId || String(p.id) === productId
        );
        setProduct(found || null);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAFAF7" }}>
        <p className="text-stone-400">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#FAFAF7" }}>
        <h1 className="text-2xl font-bold text-stone-900 mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Product Not Found
        </h1>
        <p className="text-stone-400 mb-6">This product doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart({ ...product, size: selectedSize, quantity: 1 } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="text-[11px] tracking-wide text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${product.category.toLowerCase()}`} className="hover:text-stone-700 transition-colors">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-700">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">

          {/* Image */}
          <div className="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden">
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="50vw" priority />
            {(product.badge || discount) && (
              <span className="absolute top-5 left-5 text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-white text-stone-900">
                {discount ? `-${discount}%` : product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-[11px] tracking-[0.22em] uppercase text-stone-400 font-medium mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold text-stone-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-stone-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-stone-500 leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] tracking-[0.18em] uppercase text-stone-700 font-semibold">Select Size</p>
                {sizeError && <p className="text-[11px] text-red-500">Please select a size</p>}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SIZES.map((size) => (
                  <button key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                      selectedSize === size
                        ? "bg-stone-900 text-white border-stone-900"
                        : "border-stone-200 text-stone-700 hover:border-stone-400"
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart}
              className={`w-full py-4 rounded-full text-[11px] tracking-widest uppercase font-bold transition-all duration-200 ${
                added ? "bg-green-700 text-white" : "bg-stone-900 text-white hover:bg-stone-700"
              }`}>
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>

            {/* Details */}
            <div className="mt-10 pt-8 border-t border-stone-200 space-y-4">
              {[
                { label: "Free Shipping", desc: "On orders over Rs. 3,000" },
                { label: "Easy Returns", desc: "30-day return policy" },
                { label: "Authentic Quality", desc: "100% genuine materials" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                  <span className="font-semibold text-stone-800">{label}</span>
                  <span className="text-stone-400">— {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-[11px] tracking-[0.18em] uppercase text-stone-400 font-semibold mb-6">You May Also Like</h2>
            <div className="grid gap-x-5 gap-y-10 grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p as any} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}