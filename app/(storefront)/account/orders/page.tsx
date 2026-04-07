import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Order History</h1>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>No orders yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
