import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const WOMEN_TABS = [
  { label: "All",      href: "/women",          active: false },
  { label: "Heels",    href: "/women/heels",    active: false },
  { label: "Flats",    href: "/women/flats",    active: true  },
  { label: "Sneakers", href: "/women/sneakers", active: false },
  { label: "Boots",    href: "/women/boots",    active: false },
  { label: "Sandals",  href: "/women/sandals",  active: false },
];

export default function WomenFlatsPage() {
  return (
    <CategoryPageLayout
      title="Women's Flats"
      subtitle="Effortless style from morning to night."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }, { label: "Flats", href: "/women/flats" }]}
      tabs={WOMEN_TABS}
    >
      <CategoryProductList gender="Women" subcategory="Flats" />
    </CategoryPageLayout>
  );
}