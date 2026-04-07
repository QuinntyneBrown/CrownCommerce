import { InquiryForm } from "@/lib/features/inquiry-form";

export default function WholesalePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-4 text-center">Wholesale Inquiries</h1>
      <p className="text-muted-foreground text-center mb-8">Interested in carrying our products? Fill out the form below and we&apos;ll get back to you with pricing and details.</p>
      <InquiryForm category="wholesale" title="Wholesale Application" />
    </div>
  );
}
