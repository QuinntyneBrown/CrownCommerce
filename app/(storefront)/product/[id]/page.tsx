import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex gap-2 mb-4">
            {product.type && <Badge>{product.type}</Badge>}
            {product.texture && <Badge variant="secondary">{product.texture}</Badge>}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          {product.length && <p className="text-sm text-muted-foreground mb-2">Length: {product.length}</p>}
          <p className="text-3xl font-bold text-accent mb-8">${product.price}</p>
          <Button size="lg" className="w-full md:w-auto">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
