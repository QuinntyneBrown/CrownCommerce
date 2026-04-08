import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/catalog";
import { desc, eq } from "drizzle-orm";
import { ProductGrid } from "@/lib/features/product-grid";

export default async function BundlesPage() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      type: products.type,
      texture: products.texture,
      length: products.length,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .where(eq(products.type, "Bundle"))
    .orderBy(desc(products.createdAt))
    .limit(48);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid title="Hair Bundles" subtitle="Premium quality hair bundles from the finest origins" products={allProducts} />
    </div>
  );
}
