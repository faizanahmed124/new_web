import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Tab {
  label: string;
  href: string;
  active: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  tabs: Tab[];
  children: React.ReactNode;
}

export default function CategoryPageLayout({
  title,
  subtitle,
  breadcrumbs,
  tabs,
  children,
}: Props) {
  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-[11px] text-stone-400 tracking-wide">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <Link href={crumb.href} className="hover:text-stone-700 transition-colors">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="block w-8 h-px bg-stone-300" />
          <span className="text-[10px] tracking-[0.22em] uppercase text-stone-400 font-medium">
            Collection
          </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl font-black text-stone-900 mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-stone-400 text-sm">{subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`shrink-0 text-[11px] tracking-[0.12em] uppercase font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                tab.active
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {children}
      </div>
    </div>
  );
}