import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Products</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">12</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Orders</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">0</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Subscribers</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">0</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Inquiries</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">0</p></CardContent></Card>
      </div>
    </div>
  );
}
