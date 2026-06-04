import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const MEN_TABS = [
  { label: "All",      href: "/men",          active: false },
  { label: "Sneakers", href: "/men/sneakers", active: false },
  { label: "Formal",   href: "/men/formal",   active: false },
  { label: "Loafers",  href: "/men/loafers",  active: true  },
  { label: "Boots",    href: "/men/boots",    active: false },
  { label: "Sandals",  href: "/men/sandals",  active: false },
];

export default function MenLoafersPage() {
  return (
    <CategoryPageLayout
      title="Men's Loafers"
      subtitle="Slip-on comfort with a polished finish."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men", href: "/men" }, { label: "Loafers", href: "/men/loafers" }]}
      tabs={MEN_TABS}
    >
      <CategoryProductList gender="Men" subcategory="Loafers" />
    </CategoryPageLayout>
  );
}