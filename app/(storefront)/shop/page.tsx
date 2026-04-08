import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/catalog";
import { desc, asc, eq, ilike, and, gte, lte, type SQL } from "drizzle-orm";
import { ProductGrid } from "@/lib/features/product-grid";

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = params.q;
  const type = params.category || params.type;
  const texture = params.texture;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const length = params.length;
  const sort = params.sort || "newest";

  const conditions: SQL[] = [];
  if (q) conditions.push(ilike(products.name, `%${q}%`));
  if (type) conditions.push(eq(products.type, type));
  if (texture) conditions.push(eq(products.texture, texture));
  if (minPrice) conditions.push(gte(products.price, minPrice));
  if (maxPrice) conditions.push(lte(products.price, maxPrice));
  if (length) conditions.push(eq(products.length, length));

  const orderBy = sort === "price-asc" ? asc(products.price)
    : sort === "price-desc" ? desc(products.price)
    : sort === "name" ? asc(products.name)
    : desc(products.createdAt);

  const where = conditions.length > 0 ? and(...conditions) : undefined;

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
    .where(where)
    .orderBy(orderBy)
    .limit(48);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid title="All Products" subtitle="Browse our complete collection of premium hair products" products={allProducts} />
    </div>
  );
}
