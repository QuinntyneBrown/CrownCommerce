import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema/newsletter";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const token = params.token;

  if (!token) notFound();

  const [subscriber] = await db
    .select({ id: subscribers.id, status: subscribers.status })
    .from(subscribers)
    .where(eq(subscribers.token, token));

  if (!subscriber) notFound();

  // Idempotent: only update if still pending
  if (subscriber.status === "pending") {
    await db
      .update(subscribers)
      .set({ status: "confirmed", confirmedAt: new Date() })
      .where(eq(subscribers.id, subscriber.id));
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <Card><CardContent className="p-8">
        <h1 className="font-heading text-2xl font-bold text-accent mb-4">Subscription Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for subscribing. You&apos;ll receive our latest updates and exclusive offers.</p>
      </CardContent></Card>
    </div>
  );
}
