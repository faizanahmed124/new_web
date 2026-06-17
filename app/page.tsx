import ProductList from "@/components/home/ProductList";
import Link from "next/link";
      import SplitBanner from "@/components/home/SplitBanner";


export default function Home() {
  return (
    <div className="min-h-screen pt-10" style={{ backgroundColor: "#FAFAF7" }}>

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
          className="text-5xl sm:text-7xl xl:text-8xl font-black leading-[1.06] text-stone-900 tracking-tight mb-5 max-w-2xl mx-auto"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Step Into{" "}
          <em className="not-italic text-black">Style</em>
        </h1>

        <p className="text-base sm:text-lg text-stone-500 max-w-md mx-auto leading-relaxed mb-8 font-light">
          Premium sneakers, formals &amp; more — comfort, design, and
          performance in every pair.
        </p>


      </section>

      {/* ── Category Cards ── */}
      <section className="px-2 sm:px-3 lg:px-4 mb-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 text-center mb-2 font-medium">
            Shop by Category
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { href: "/men",    emoji: "👟", label: "Men",   sub: "180 styles",    bg: "#F5F3EE" },
              { href: "/women",  emoji: "👠", label: "Women", sub: "220 styles",    bg: "#F7F3EC" },
              { href: "/sale",   emoji: "🏷️", label: "Sale",  sub: "Up to 50% off", bg: "#FDF1F1", badge: "HOT" },
            ].map(({ href, emoji, label, sub, bg, badge }) => (
              <Link
                key={href}
                href={href}
                className="border border-stone-200 hover:border-stone-400 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all group"
                style={{ backgroundColor: bg }}
              >
                <span className="text-4xl">{emoji}</span>
                <span className="text-sm font-semibold text-stone-800 tracking-wide">{label}</span>
                <span className="text-xs text-stone-400">{sub}</span>
                {badge && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full tracking-wider">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
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