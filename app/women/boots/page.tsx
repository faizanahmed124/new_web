import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const WOMEN_TABS = [
  { label: "All",      href: "/women",          active: false },
  { label: "Heels",    href: "/women/heels",    active: false },
  { label: "Flats",    href: "/women/flats",    active: false },
  { label: "Sneakers", href: "/women/sneakers", active: false },
  { label: "Boots",    href: "/women/boots",    active: true  },
  { label: "Sandals",  href: "/women/sandals",  active: false },
];

export default function WomenBootsPage() {
  return (
    <CategoryPageLayout
      title="Women's Boots"
      subtitle="Bold, beautiful, and built to last."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }, { label: "Boots", href: "/women/boots" }]}
      tabs={WOMEN_TABS}
    >
      <CategoryProductList gender="Women" subcategory="Boots" />
    </CategoryPageLayout>
  );
}