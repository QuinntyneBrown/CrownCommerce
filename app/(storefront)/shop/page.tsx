import { ProductGrid } from "@/lib/features/product-grid";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid title="All Products" subtitle="Browse our complete collection of premium hair products" products={products} />
    </div>
  );
}
