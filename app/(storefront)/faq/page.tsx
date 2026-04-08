import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema/content";
import { asc } from "drizzle-orm";
import { FAQList } from "@/lib/features/faq-list";

export default async function FAQPage() {
  const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.category));

  return (
    <div className="container mx-auto px-4 py-8">
      <FAQList faqs={allFaqs} />
    </div>
  );
}
