import { InquiryForm } from "@/lib/features/inquiry-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <InquiryForm category="general" title="Contact Us" />
    </div>
  );
}
