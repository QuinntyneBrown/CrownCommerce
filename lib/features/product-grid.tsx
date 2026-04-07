import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  texture?: string | null;
  type?: string | null;
  length?: string | null;
}

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: Product[];
}

export function ProductGrid({ title, subtitle, products }: ProductGridProps) {
  return (
    <section className="py-16">
      {title && <SectionHeader title={title} subtitle={subtitle} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      )}
    </section>
  );
}
