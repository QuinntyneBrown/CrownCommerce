import { EmailSignup } from "@/components/email-signup";
import { Countdown } from "@/components/countdown";

export default function ManeHausComingSoonPage() {
  return (
    <div className="text-center px-4 max-w-xl">
      <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">Mane Haus</h1>
      <p className="text-xl text-muted-foreground mb-8">Luxury hair, elevated. Coming soon.</p>
      <div className="mb-8">
        <Countdown targetDate="2026-06-01T00:00:00Z" />
      </div>
      <div className="flex justify-center"><EmailSignup brandTag="mane-haus" buttonText="Notify Me" /></div>
    </div>
  );
}
