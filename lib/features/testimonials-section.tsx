import { TestimonialCard } from "@/components/testimonial-card";
import { SectionHeader } from "@/components/section-header";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
  location?: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-16">
      <SectionHeader title="What Our Clients Say" subtitle="Real reviews from real customers" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} {...t} />
        ))}
      </div>
    </section>
  );
}
