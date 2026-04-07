import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ProductsPage() {
  const products = await getProducts();

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
              {products.map((p: { id: string; name: string; type: string; price: string; length: string }) => (
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
