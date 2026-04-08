import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/content";
import { eq } from "drizzle-orm";

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
  if (!page) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose prose-invert max-w-none text-foreground/90">{page.body}</div>
    </div>
  );
}
