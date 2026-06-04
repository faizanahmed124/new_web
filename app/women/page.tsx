"use client";
import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";
const TABS = [
  { label: "All",      href: "/women",          active: true  },
  { label: "Heels",    href: "/women/heels",    active: false },
  { label: "Flats",    href: "/women/flats",    active: false },
  { label: "Sneakers", href: "/women/sneakers", active: false },
  { label: "Boots",    href: "/women/boots",    active: false },
  { label: "Sandals",  href: "/women/sandals",  active: false },
];
export default function WomenPage() {
  return (
    <CategoryPageLayout
      title="Women's Shoes"
      subtitle="50 styles designed for elegance and comfort."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }]}
      tabs={TABS}
    >
      <CategoryProductList gender="Women" />
    </CategoryPageLayout>
  );
}
