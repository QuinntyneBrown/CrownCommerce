import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getBundleDeals() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/bundle-deals`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function BundleDealsPage() {
  const deals = await getBundleDeals();

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader title="Bundle Deals" subtitle="Save more when you bundle" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal: { id: string; name: string; originalPrice: string; dealPrice: string }) => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <h3 className="font-heading font-bold text-lg mb-2">{deal.name}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-muted-foreground line-through">${deal.originalPrice}</span>
                <span className="text-accent font-bold text-xl">${deal.dealPrice}</span>
                <Badge>Save ${(parseFloat(deal.originalPrice) - parseFloat(deal.dealPrice)).toFixed(2)}</Badge>
              </div>
              <Button className="w-full">Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
        {deals.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No deals available right now. Check back soon!</p>}
      </div>
    </div>
  );
}
