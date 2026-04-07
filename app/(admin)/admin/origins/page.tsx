import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getOrigins() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/catalog/origins`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function OriginsPage() {
  const origins = await getOrigins();
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Origins</h1>
        <Button>Add Origin</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border"><th className="text-left p-4">Name</th><th className="text-left p-4">Country</th></tr></thead>
          <tbody>{origins.map((o: { id: string; name: string; country: string }) => (
            <tr key={o.id} className="border-b border-border hover:bg-muted/50"><td className="p-4 font-medium">{o.name}</td><td className="p-4">{o.country}</td></tr>
          ))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
