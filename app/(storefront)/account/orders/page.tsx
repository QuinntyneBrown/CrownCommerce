import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, session.sub))
    .orderBy(desc(orders.createdAt))
    .limit(25);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Order History</h1>
      {userOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <Link key={order.id} href={`/order/${order.id}`}>
              <Card className="hover:border-accent transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">${order.total}</span>
                    <Badge>{order.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
