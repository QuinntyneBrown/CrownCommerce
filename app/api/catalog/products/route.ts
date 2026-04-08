import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/catalog";
import { withAdmin } from "@/lib/auth/middleware";
import { desc, asc, eq, ilike, and, gte, lte, type SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const q = params.get("q");
    const type = params.get("category") || params.get("type");
    const texture = params.get("texture");
    const origin = params.get("origin");
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    const length = params.get("length");
    const sort = params.get("sort") || "newest";
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "24", 10) || 24));

    const conditions: SQL[] = [];
    if (q) conditions.push(ilike(products.name, `%${q}%`));
    if (type) conditions.push(eq(products.type, type));
    if (texture) conditions.push(eq(products.texture, texture));
    if (origin) conditions.push(eq(products.originId, origin));
    if (minPrice) conditions.push(gte(products.price, minPrice));
    if (maxPrice) conditions.push(lte(products.price, maxPrice));
    if (length) conditions.push(eq(products.length, length));

    const orderBy = sort === "price-asc" ? asc(products.price)
      : sort === "price-desc" ? desc(products.price)
      : sort === "name" ? asc(products.name)
      : desc(products.createdAt);

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const results = await db
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
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  texture: z.string().optional(),
  type: z.string().optional(),
  length: z.string().optional(),
  originId: z.string().uuid().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export async function POST(request: NextRequest) {
  return withAdmin(request, async () => {
    const json = await request.json();
    const input = createProductSchema.parse(json);
    const [product] = await db.insert(products).values(input).returning();
    return NextResponse.json(product, { status: 201 });
  });
}
