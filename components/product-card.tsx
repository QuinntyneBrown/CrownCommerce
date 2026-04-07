import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  texture?: string | null;
  type?: string | null;
  length?: string | null;
}

export function ProductCard({ id, name, price, imageUrl, texture, type, length }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-accent/50">
        <div className="aspect-square relative bg-muted overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-heading font-semibold text-sm line-clamp-2">{name}</h3>
          <div className="flex items-center gap-2 mt-2">
            {type && <Badge variant="secondary" className="text-xs">{type}</Badge>}
            {length && <span className="text-xs text-muted-foreground">{length}</span>}
          </div>
          <p className="text-accent font-bold mt-2">${price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
