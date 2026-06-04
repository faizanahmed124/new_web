import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const WOMEN_TABS = [
  { label: "All",      href: "/women",          active: false },
  { label: "Heels",    href: "/women/heels",    active: false },
  { label: "Flats",    href: "/women/flats",    active: false },
  { label: "Sneakers", href: "/women/sneakers", active: false },
  { label: "Boots",    href: "/women/boots",    active: false },
  { label: "Sandals",  href: "/women/sandals",  active: true  },
];

export default function WomenSandalsPage() {
  return (
    <CategoryPageLayout
      title="Women's Sandals"
      subtitle="Light, airy, and made for summer."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }, { label: "Sandals", href: "/women/sandals" }]}
      tabs={WOMEN_TABS}
    >
      <CategoryProductList gender="Women" subcategory="Sandals" />
    </CategoryPageLayout>
  );
}