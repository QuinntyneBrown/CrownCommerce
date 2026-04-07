import { InquiryForm } from "@/lib/features/inquiry-form";

export default function AmbassadorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-4 text-center">Ambassador Program</h1>
      <p className="text-muted-foreground text-center mb-8">Join our team of brand ambassadors and earn while sharing products you love.</p>
      <InquiryForm category="ambassador" title="Ambassador Application" />
    </div>
  );
}
