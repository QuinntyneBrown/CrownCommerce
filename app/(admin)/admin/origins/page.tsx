import { db } from "@/lib/db";
import { origins } from "@/lib/db/schema/catalog";
import { asc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function OriginsPage() {
  const allOrigins = await db
    .select({
      id: origins.id,
      name: origins.name,
      country: origins.country,
    })
    .from(origins)
    .orderBy(asc(origins.name))
    .limit(50);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Origins</h1>
        <Button>Add Origin</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left p-4">Name</th><th className="text-left p-4">Country</th></tr></thead>
          <tbody>{allOrigins.map((o) => (
            <tr key={o.id} className="border-b border-border hover:bg-muted/50"><td className="p-4 font-medium">{o.name}</td><td className="p-4">{o.country}</td></tr>
          ))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
