"use client";

import { useCart } from "@/context/CartContext";
import { Menu, Search, X, ChevronDown, Tag, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function Header() {
  const { cart } = useCart();
  const cartCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveMega(null);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), []);
  const isActivePath = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const menCategories = [
    { href: "/men/sneakers", label: "Sneakers" },
    { href: "/men/formal",   label: "Formal"   },
    { href: "/men/loafers",  label: "Loafers"  },
    { href: "/men/boots",    label: "Boots"    },
    { href: "/men/sandals",  label: "Sandals"  },
    { href: "/men",          label: "View All Men" },
  ];

  const womenCategories = [
    { href: "/women/heels",    label: "Heels"    },
    { href: "/women/flats",    label: "Flats"    },
    { href: "/women/sneakers", label: "Sneakers" },
    { href: "/women/boots",    label: "Boots"    },
    { href: "/women/sandals",  label: "Sandals"  },
    { href: "/women",          label: "View All Women" },
  ];

  const navItems = [
    { href: "/men",     label: "Men",     mega: "men"   },
    { href: "/women",   label: "Women",   mega: "women" },
    { href: "/sale",    label: "Sale",    isSale: true  },
    { href: "/contact", label: "Contact"               },
  ];

  const CartIcon = () => (
    <Link href="/cart"
      className="relative p-2 rounded-full hover:bg-stone-100 transition-all duration-200 group"
      aria-label={`Cart ${cartCount}`}>
      <ShoppingBag className="h-5 w-5 text-stone-700 group-hover:text-stone-900 transition-colors" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-xl border-b border-stone-300 shadow-md" : "border-b border-stone-300"
        }`}
        style={{ backgroundColor: "#F0EDE6" }}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3">

          {/* ── DESKTOP ── */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <Link className="shrink-0 group" href="/">
              <img src="/images/logo.jpeg" alt="Forty Shoes" className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity duration-200" />
            </Link>

            <nav className="flex items-center space-x-1">
              {navItems.map(({ href, label, mega, isSale }) => (
                <div key={href} className="relative"
                  onMouseEnter={() => mega ? setActiveMega(mega) : setActiveMega(null)}>
                  <Link href={href}
                    className={`relative flex items-center gap-1 py-2 px-4 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                      isSale ? "text-red-600 hover:bg-red-50"
                        : isActivePath(href) ? "text-stone-900 bg-stone-100"
                        : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                    style={{ letterSpacing: "0.04em" }}>
                    {isSale && <Tag className="h-3.5 w-3.5" />}
                    {label}
                    {mega && <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeMega === mega ? "rotate-180" : ""}`} />}
                    {isSale && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-4">HOT</span>
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex flex-1 max-w-xs mx-4">
              <form className="relative w-full">
                <input type="search" placeholder="Search shoes..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all bg-stone-50" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              </form>
            </div>

            <div className="flex items-center gap-2">
              <CartIcon />
              <Link href="/customer/signin">
                <Button variant="ghost" size="sm" className="text-xs font-semibold tracking-wide text-stone-700 hover:text-stone-900">Sign In</Button>
              </Link>
              <Link href="/customer/signin">
                <Button size="sm" className="text-xs font-semibold tracking-wide bg-stone-900 hover:bg-stone-700 text-white rounded-full px-4">Sign Up</Button>
              </Link>
            </div>
          </div>

          {/* ── MOBILE ── 3-column: hamburger | center logo | search+cart */}
          <div className="flex md:hidden items-center justify-between relative">

            {/* Left */}
            <button onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
              aria-label="Toggle menu" aria-expanded={isMobileOpen}>
              {isMobileOpen ? <X className="h-5 w-5 text-stone-700" /> : <Menu className="h-5 w-5 text-stone-700" />}
            </button>

            {/* Center Logo — absolute centered */}
            <Link className="absolute left-1/2 -translate-x-1/2 group" href="/">
              <img src="/images/logo.jpeg" alt="Forty Shoes" className="h-9 w-auto object-contain group-hover:opacity-80 transition-opacity duration-200" />
            </Link>

            {/* Right */}
            <div className="flex items-center gap-1 z-10">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                <Search className="h-5 w-5 text-stone-700" />
              </button>
              <CartIcon />
            </div>
          </div>

          {/* Mobile search */}
          {isSearchOpen && (
            <div className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
              <form className="relative">
                <input type="search" placeholder="Search shoes..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 bg-stone-50"
                  autoFocus />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              </form>
            </div>
          )}

          {/* Mobile nav */}
          {isMobileOpen && (
            <nav className="md:hidden mt-3 animate-in slide-in-from-top duration-200">
              <div className="flex flex-col pb-4 border-b border-stone-200 space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold px-3 pt-2 pb-1">Men</div>
                {menCategories.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={closeMobileMenu}
                    className="text-sm py-1.5 px-3 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all">{label}</Link>
                ))}
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold px-3 pt-3 pb-1">Women</div>
                {womenCategories.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={closeMobileMenu}
                    className="text-sm py-1.5 px-3 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all">{label}</Link>
                ))}
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold px-3 pt-3 pb-1">Offers</div>
                <Link href="/sale" onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-md text-red-600 hover:bg-red-50 transition-all">
                  <Tag className="h-4 w-4" /> Sale Items
                </Link>
                <Link href="/contact" onClick={closeMobileMenu}
                  className="text-sm py-1.5 px-3 rounded-md text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all">Contact</Link>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" className="w-full text-sm border-stone-300" asChild>
                  <Link href="/customer/signin" onClick={closeMobileMenu}>Sign In</Link>
                </Button>
                <Button className="w-full text-sm bg-stone-900 hover:bg-stone-700 text-white" asChild>
                  <Link href="/customer/signin" onClick={closeMobileMenu}>Sign Up</Link>
                </Button>
              </div>
            </nav>
          )}
        </div>

        {/* Mega Menu */}
        {activeMega && (
          <div className="hidden md:block absolute left-0 right-0 bg-white border-b border-stone-200 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="container mx-auto px-6 py-8">
              <div className="flex gap-16">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4">
                    {activeMega === "men" ? "Shop Men" : "Shop Women"}
                  </p>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                    {(activeMega === "men" ? menCategories : womenCategories).map(({ href, label }) => (
                      <Link key={href} href={href}
                        className="text-sm text-stone-700 hover:text-stone-900 font-medium py-1 hover:underline underline-offset-4 transition-all">{label}</Link>
                    ))}
                  </div>
                </div>
                <div className="border-l border-stone-100 pl-16">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4">Featured</p>
                  <Link href="/sale" className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                    <Tag className="h-4 w-4" />
                    Sale — Up to 50% off {activeMega === "men" ? "men's" : "women's"} shoes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}