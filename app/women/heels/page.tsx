import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const WOMEN_TABS = [
  { label: "All",      href: "/women",          active: false },
  { label: "Heels",    href: "/women/heels",    active: true  },
  { label: "Flats",    href: "/women/flats",    active: false },
  { label: "Sneakers", href: "/women/sneakers", active: false },
  { label: "Boots",    href: "/women/boots",    active: false },
  { label: "Sandals",  href: "/women/sandals",  active: false },
];

export default function WomenHeelsPage() {
  return (
    <CategoryPageLayout
      title="Women's Heels"
      subtitle="Elevate every step with confidence."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }, { label: "Heels", href: "/women/heels" }]}
      tabs={WOMEN_TABS}
    >
      <CategoryProductList gender="Women" subcategory="Heels" />
    </CategoryPageLayout>
  );
}