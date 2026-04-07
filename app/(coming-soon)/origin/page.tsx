import { EmailSignup } from "@/components/email-signup";

export default function OriginComingSoonPage() {
  return (
    <div className="text-center px-4 max-w-xl">
      <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Origin Hair Collective</h1>
      <p className="text-xl text-muted-foreground mb-8">Something extraordinary is coming. Be the first to know.</p>
      <div className="flex justify-center"><EmailSignup brandTag="origin" buttonText="Notify Me" /></div>
    </div>
  );
}
