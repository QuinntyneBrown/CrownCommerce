import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/catalog";
import { withAdmin } from "@/lib/auth/middleware";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
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
      .orderBy(desc(products.createdAt));
    return NextResponse.json(allProducts);
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
