import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const MEN_TABS = [
  { label: "All",      href: "/men",          active: false },
  { label: "Sneakers", href: "/men/sneakers", active: false },
  { label: "Formal",   href: "/men/formal",   active: false },
  { label: "Loafers",  href: "/men/loafers",  active: false },
  { label: "Boots",    href: "/men/boots",    active: true  },
  { label: "Sandals",  href: "/men/sandals",  active: false },
];

export default function MenBootsPage() {
  return (
    <CategoryPageLayout
      title="Men's Boots"
      subtitle="Built tough for every season."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men", href: "/men" }, { label: "Boots", href: "/men/boots" }]}
      tabs={MEN_TABS}
    >
      <CategoryProductList gender="Men" subcategory="Boots" />
    </CategoryPageLayout>
  );
}