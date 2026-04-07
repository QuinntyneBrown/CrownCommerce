import { FAQList } from "@/lib/features/faq-list";

async function getFaqs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/content/faqs`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <div className="container mx-auto px-4 py-8">
      <FAQList faqs={faqs} />
    </div>
  );
}
