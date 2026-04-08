import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getOrder(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/orders/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  if (order.userId && order.userId !== session.sub && session.role !== "admin") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Order #{id.slice(0, 8)}</h1>
      <Card>
        <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge>{order.status}</Badge>
          </div>
          <p><strong>Total:</strong> ${order.total}</p>
          {order.shippingAddress && <p><strong>Shipping:</strong> {order.shippingAddress}</p>}
          <p className="text-sm text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
