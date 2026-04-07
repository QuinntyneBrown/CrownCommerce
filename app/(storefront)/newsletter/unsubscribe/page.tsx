import { Card, CardContent } from "@/components/ui/card";

export default function UnsubscribePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <Card><CardContent className="p-8">
        <h1 className="font-heading text-2xl font-bold mb-4">Unsubscribed</h1>
        <p className="text-muted-foreground">You have been unsubscribed from our newsletter. We&apos;re sorry to see you go.</p>
      </CardContent></Card>
    </div>
  );
}
