import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-8">My Account</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {session.name}</p>
            <p><strong>Email:</strong> {session.email}</p>
            <p><strong>Role:</strong> {session.role}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
          <CardContent>
            <Link href="/account/orders" className="text-accent hover:underline">View Order History →</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
