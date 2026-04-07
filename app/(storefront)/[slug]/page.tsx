import { notFound } from "next/navigation";

async function getPage(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/content/pages`, { cache: "no-store" });
    if (!res.ok) return null;
    const pages = await res.json();
    return pages.find((p: { slug: string }) => p.slug === slug) || null;
  } catch { return null; }
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose prose-invert max-w-none text-foreground/90">{page.body}</div>
    </div>
  );
}
