"use client";

import products from "@/data/products.json";
import ProductCard from "@/components/home/ProductCard";

interface Props {
  gender: "Men" | "Women";
  subcategory?: string;
}

export default function CategoryProductList({ gender, subcategory }: Props) {
  const allGender = products.filter((p) => p.category === gender);

  const filtered = subcategory
    ? allGender.filter(
        (p) =>
          p.name.toLowerCase().includes(subcategory.toLowerCase()) ||
          p.description.toLowerCase().includes(subcategory.toLowerCase())
      )
    : allGender;

  const display = filtered.length > 0 ? filtered : allGender;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100 px-1">
        <p className="text-[11px] text-stone-400 tracking-[0.18em] uppercase font-medium">
          {display.length} Products
        </p>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-stone-400 tracking-[0.18em] uppercase font-medium hidden sm:block">
            Sort by
          </span>
          <select className="text-[12px] border border-stone-200 rounded-lg px-3 py-1.5 text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {display.map((product, index) => (
          <div
            key={product.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{
              animationDelay: `${index * 40}ms`,
              animationFillMode: "both",
            }}
          >
            <ProductCard
              product={{
                ...product,
                originalPrice: product.originalPrice ?? undefined,
                badge: product.badge ?? undefined,
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-14">
        <button className="group flex items-center gap-2.5 border border-stone-900 text-stone-900 text-[11px] tracking-[0.18em] uppercase font-semibold px-10 py-3.5 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-200">
          Load More
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}