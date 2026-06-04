import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const MEN_TABS = [
  { label: "All",      href: "/men",          active: false },
  { label: "Sneakers", href: "/men/sneakers", active: false },
  { label: "Formal",   href: "/men/formal",   active: false },
  { label: "Loafers",  href: "/men/loafers",  active: false },
  { label: "Boots",    href: "/men/boots",    active: false },
  { label: "Sandals",  href: "/men/sandals",  active: true  },
];

export default function MenSandalsPage() {
  return (
    <CategoryPageLayout
      title="Men's Sandals"
      subtitle="Breathable styles for warm weather."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men", href: "/men" }, { label: "Sandals", href: "/men/sandals" }]}
      tabs={MEN_TABS}
    >
      <CategoryProductList gender="Men" subcategory="Sandals" />
    </CategoryPageLayout>
  );
}