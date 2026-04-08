import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) notFound();

  // Authorization: user can only view their own orders (admin override)
  if (order.userId && order.userId !== session.sub && session.role !== "admin") {
    notFound();
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Order #{id.slice(0, 8)}</h1>
      <Card>
        <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge>{order.status}</Badge>
          </div>
          <p><strong>Total:</strong> ${order.total}</p>
          {order.shippingAddress && <p><strong>Shipping:</strong> {order.shippingAddress}</p>}
          <p className="text-sm text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>

          {items.length > 0 && (
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>Product {item.productId.slice(0, 8)} x{item.quantity}</span>
                    <span>${item.unitPrice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
