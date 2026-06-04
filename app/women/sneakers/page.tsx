import CategoryPageLayout from "@/components/home/CategoryPageLayout";
import CategoryProductList from "@/components/home/CategoryProductList";

const WOMEN_TABS = [
  { label: "All",      href: "/women",          active: false },
  { label: "Heels",    href: "/women/heels",    active: false },
  { label: "Flats",    href: "/women/flats",    active: false },
  { label: "Sneakers", href: "/women/sneakers", active: true  },
  { label: "Boots",    href: "/women/boots",    active: false },
  { label: "Sandals",  href: "/women/sandals",  active: false },
];

export default function WomenSneakersPage() {
  return (
    <CategoryPageLayout
      title="Women's Sneakers"
      subtitle="Sporty meets feminine — all day comfort."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }, { label: "Sneakers", href: "/women/sneakers" }]}
      tabs={WOMEN_TABS}
    >
      <CategoryProductList gender="Women" subcategory="Sneakers" />
    </CategoryPageLayout>
  );
}