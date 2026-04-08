import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/catalog";
import { orders } from "@/lib/db/schema/orders";
import { subscribers } from "@/lib/db/schema/newsletter";
import { inquiries } from "@/lib/db/schema/inquiries";
import { count } from "drizzle-orm";

async function getDashboardCounts() {
  const [[productCount], [orderCount], [subscriberCount], [inquiryCount]] = await Promise.all([
    db.select({ value: count() }).from(products),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(subscribers),
    db.select({ value: count() }).from(inquiries),
  ]);

  return {
    products: productCount.value,
    orders: orderCount.value,
    subscribers: subscriberCount.value,
    inquiries: inquiryCount.value,
  };
}

export default async function DashboardPage() {
  const counts = await getDashboardCounts();

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Products</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{counts.products}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Orders</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{counts.orders}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Subscribers</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{counts.subscribers}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Inquiries</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{counts.inquiries}</p></CardContent></Card>
      </div>
    </div>
  );
}
