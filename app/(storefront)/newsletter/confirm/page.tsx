import { Card, CardContent } from "@/components/ui/card";

export default function ConfirmPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <Card><CardContent className="p-8">
        <h1 className="font-heading text-2xl font-bold text-accent mb-4">Subscription Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for subscribing. You&apos;ll receive our latest updates and exclusive offers.</p>
      </CardContent></Card>
    </div>
  );
}
