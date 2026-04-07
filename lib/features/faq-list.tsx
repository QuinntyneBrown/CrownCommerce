"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
}

interface FAQListProps {
  faqs: FAQ[];
  title?: string;
}

export function FAQList({ faqs, title = "Frequently Asked Questions" }: FAQListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-16">
      <SectionHeader title={title} />
      <div className="max-w-3xl mx-auto space-y-2">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown className={cn("h-5 w-5 transition-transform", openId === faq.id && "rotate-180")} />
            </button>
            {openId === faq.id && (
              <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
