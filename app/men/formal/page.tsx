import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const MEN_TABS = [
  { label: "All",      href: "/men",          active: false },
  { label: "Sneakers", href: "/men/sneakers", active: false },
  { label: "Formal",   href: "/men/formal",   active: true  },
  { label: "Loafers",  href: "/men/loafers",  active: false },
  { label: "Boots",    href: "/men/boots",    active: false },
  { label: "Sandals",  href: "/men/sandals",  active: false },
];

export default function MenFormalPage() {
  return (
    <CategoryPageLayout
      title="Men's Formal"
      subtitle="Sharp looks for every occasion."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men", href: "/men" }, { label: "Formal", href: "/men/formal" }]}
      tabs={MEN_TABS}
    >
      <CategoryProductList gender="Men" subcategory="Formal" />
    </CategoryPageLayout>
  );
}