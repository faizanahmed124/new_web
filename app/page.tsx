import ProductList from "@/components/home/ProductList";
import Link from "next/link";
      import SplitBanner from "@/components/home/SplitBanner";


export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* ── Hero Section ── */}
      <section className="px-4 pt-1 pb-10 sm:pt-2 lg:pt-2 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-9 h-px bg-stone-300" />
          <span className="text-[10px] tracking-[0.22em] uppercase text-stone-400 font-medium">
            New Collection · 2025
          </span>
          <span className="block w-9 h-px bg-stone-300" />
        </div>

        <h1
          className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.06] text-stone-900 tracking-tight mb-5 max-w-2xl mx-auto"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Step Into{" "}
          <em className="not-italic text-black">Style</em>
        </h1>

        <p className="text-base sm:text-lg text-stone-500 max-w-md mx-auto leading-relaxed mb-8 font-light">
          Premium sneakers, formals &amp; more — comfort, design, and
          performance in every pair.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
          <Link
            href="/men"
            className="bg-stone-900 text-white text-xs tracking-widest uppercase font-semibold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors"
          >
            Shop Men
          </Link>
          <Link
            href="/women"
            className="bg-stone-900 text-white text-xs tracking-widest uppercase font-semibold px-7 py-3 rounded-full hover:bg-stone-700 transition-colors"
          >
            Shop Women
          </Link>
          <Link
            href="/sale"
            className="border border-red-300 text-red-600 text-xs tracking-widest uppercase font-semibold px-7 py-3 rounded-full hover:bg-red-50 transition-colors"
          >
            🏷 Sale — Up to 50% Off
          </Link>
        </div>

      </section>

     
{/* // Category Cards section ke baad: */}
<SplitBanner
  leftImage="/images/forty2.png"
  rightImage="https://i.pinimg.com/736x/f6/9d/99/f69d99d0f088d04ab566326f5a7ac371.jpg"
  leftLabel="Shop Women"
  rightLabel="Shop Men"
  leftHref="/women"
  rightHref="/men"
/>

      {/* ── Product List ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 text-center mb-1 font-medium">
          Featured Picks
        </p>
        <h2
          className="text-3xl font-bold text-center text-stone-900 mb-10"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Trending Now
        </h2>
        <ProductList />
      </section>
    </div>
  );
}