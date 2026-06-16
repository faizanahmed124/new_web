"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

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

interface CategoryProductListProps {
  gender: "Men" | "Women";
  subcategory?: string;
}

// Keyword matching for subcategories since DB doesn't have a subcategory column
const SUBCATEGORY_KEYWORDS: Record<string, string[]> = {
  Sneakers: ["runner", "sneaker", "court", "racer", "pace", "flex", "edge", "horizon", "react", "retro", "force", "high", "low", "flow", "step", "form", "walk", "dream", "touch", "lite", "glide", "knit", "foam", "drift", "slip"],
  Formal:   ["formal", "oxford", "derby", "brogue"],
  Loafers:  ["loafer", "mule", "slip-on"],
  Boots:    ["boot"],
  Sandals:  ["sandal", "slide", "thong", "wrap", "fisherman"],
  Heels:    ["heel", "pump", "stiletto"],
  Flats:    ["flat", "ballet", "slingback"],
};

export default function CategoryProductList({ gender, subcategory }: CategoryProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = products.filter((p) => p.category === gender);

  if (subcategory && SUBCATEGORY_KEYWORDS[subcategory]) {
    const keywords = SUBCATEGORY_KEYWORDS[subcategory];
    filtered = filtered.filter((p) =>
      keywords.some((kw) => p.name.toLowerCase().includes(kw) || (p.description || "").toLowerCase().includes(kw))
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-stone-400">
        Loading products...
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-stone-400">
        No products found in this category yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100 px-1">
        <p className="text-[11px] text-stone-400 tracking-[0.18em] uppercase font-medium">
          {filtered.length} Products
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

      <div className="grid gap-x-5 gap-y-10 grid-cols-2 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <div key={p.id}
            className="animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: `${i * 35}ms`, animationFillMode: "both" }}>
            <ProductCard product={p as any} />
          </div>
        ))}
      </div>
    </div>
  );
}