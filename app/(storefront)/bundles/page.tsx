import { ProductGrid } from "@/lib/features/product-grid";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const products = await res.json();
    return products.filter((p: { type: string }) => p.type === "Bundle");
  } catch { return []; }
}

export default async function BundlesPage() {
  const products = await getProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid title="Hair Bundles" subtitle="Premium quality hair bundles from the finest origins" products={products} />
    </div>
  );
}
