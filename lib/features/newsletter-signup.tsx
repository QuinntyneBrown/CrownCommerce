import { EmailSignup } from "@/components/email-signup";
import { SectionHeader } from "@/components/section-header";

interface NewsletterSignupProps {
  brandTag?: string;
}

export function NewsletterSignup({ brandTag }: NewsletterSignupProps) {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <SectionHeader title="Stay in the Loop" subtitle="Get exclusive deals, new arrivals, and hair care tips delivered to your inbox." />
        <EmailSignup brandTag={brandTag} placeholder="Enter your email address" buttonText="Join Now" />
      </div>
    </section>
  );
}
