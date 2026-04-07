import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getBrand } from "@/lib/theme";
import { ProductGrid } from "@/lib/features/product-grid";
import { TestimonialsSection } from "@/lib/features/testimonials-section";
import { NewsletterSignup } from "@/lib/features/newsletter-signup";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/content/testimonials`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function HomePage() {
  const brand = await getBrand();
  const [products, testimonials] = await Promise.all([getProducts(), getTestimonials()]);

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            {brand.id === "origin" ? "Authentic Origins, Premium Hair" : "Luxury Hair, Elevated"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {brand.id === "origin"
              ? "Ethically sourced, premium quality hair bundles, closures, and frontals from the world's finest origins."
              : "Curated luxury hair collections for the modern woman who demands excellence."}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>Shop Now</Link>
            <Link href="/bundles" className={buttonVariants({ variant: "outline", size: "lg" })}>View Collections</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <ProductGrid title="Featured Products" subtitle="Our most popular selections" products={products.slice(0, 8)} />
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4">
        <TestimonialsSection testimonials={testimonials} />
      </section>

      {/* Newsletter */}
      <NewsletterSignup brandTag={brand.id} />
    </>
  );
}
