import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const MEN_TABS = [
  { label: "All",      href: "/men",          active: true  },
  { label: "Sneakers", href: "/men/sneakers", active: false },
  { label: "Formal",   href: "/men/formal",   active: false },
  { label: "Loafers",  href: "/men/loafers",  active: false },
  { label: "Boots",    href: "/men/boots",    active: false },
  { label: "Sandals",  href: "/men/sandals",  active: false },
];

export default function MenPage() {
  return (
    <CategoryPageLayout
      title="Men's Shoes"
      subtitle="50 styles crafted for performance and style."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men", href: "/men" }]}
      tabs={MEN_TABS}
    >
      <CategoryProductList gender="Men" />
    </CategoryPageLayout>
  );
}