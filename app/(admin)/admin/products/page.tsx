import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/catalog";
import { desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProductsPage() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      type: products.type,
      price: products.price,
      length: products.length,
    })
    .from(products)
    .orderBy(desc(products.createdAt))
    .limit(50);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Products</h1>
        <Button>Add Product</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Length</th>
            </tr></thead>
            <tbody>
              {allProducts.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4"><Badge variant="secondary">{p.type}</Badge></td>
                  <td className="p-4">${p.price}</td>
                  <td className="p-4">{p.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
