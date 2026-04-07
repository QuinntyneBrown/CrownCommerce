import { EmailSignup } from "@/components/email-signup";

export default function ManeHausComingSoonPage() {
  return (
    <div className="text-center px-4 max-w-xl" data-brand="mane-haus">
      <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Mane Haus</h1>
      <p className="text-xl text-muted-foreground mb-8">Luxury hair, elevated. Coming soon.</p>
      <div className="flex justify-center"><EmailSignup brandTag="mane-haus" buttonText="Notify Me" /></div>
    </div>
  );
}
