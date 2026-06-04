import Link from "next/link";

interface SplitBannerProps {
  leftImage: string;
  rightImage: string;
  leftHref?: string;
  rightHref?: string;
  leftLabel?: string;
  rightLabel?: string;
}

export default function SplitBanner({
  leftImage,
  rightImage,
  leftHref = "/women",
  rightHref = "/men",
  leftLabel = "Shop Women",
  rightLabel = "Shop Men",
}: SplitBannerProps) {
  return (
    <div className="w-full flex gap-1 rounded-2xl overflow-hidden mb-10" style={{ height: "70vh", minHeight: "420px" }}>

      {/* Left panel */}
      <Link href={leftHref} className="group relative flex-1 overflow-hidden">
        <img
          src={leftImage}
          alt={leftLabel}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-300" />
        <div className="absolute bottom-8 left-8">
          <span className="inline-block text-[11px] tracking-widest uppercase font-semibold bg-white text-stone-900 px-5 py-2.5 rounded-full group-hover:bg-stone-900 group-hover:text-white transition-all duration-200">
            {leftLabel}
          </span>
        </div>
      </Link>

      {/* Right panel */}
      <Link href={rightHref} className="group relative flex-1 overflow-hidden">
        <img
          src={rightImage}
          alt={rightLabel}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-300" />
        <div className="absolute bottom-8 left-8">
          <span className="inline-block text-[11px] tracking-widest uppercase font-semibold bg-white text-stone-900 px-5 py-2.5 rounded-full group-hover:bg-stone-900 group-hover:text-white transition-all duration-200">
            {rightLabel}
          </span>
        </div>
      </Link>

    </div>
  );
}