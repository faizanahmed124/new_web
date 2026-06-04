import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const MEN_TABS = [
  { label: "All",      href: "/men",          active: false },
  { label: "Sneakers", href: "/men/sneakers", active: true  },
  { label: "Formal",   href: "/men/formal",   active: false },
  { label: "Loafers",  href: "/men/loafers",  active: false },
  { label: "Boots",    href: "/men/boots",    active: false },
  { label: "Sandals",  href: "/men/sandals",  active: false },
];

export default function MenSneakersPage() {
  return (
    <CategoryPageLayout
      title="Men's Sneakers"
      subtitle="Fresh kicks for every occasion."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men", href: "/men" }, { label: "Sneakers", href: "/men/sneakers" }]}
      tabs={MEN_TABS}
    >
      <CategoryProductList gender="Men" subcategory="Sneakers" />
    </CategoryPageLayout>
  );
}