import { db } from "@/lib/db";
import { channels } from "@/lib/db/schema/scheduling";
import { asc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ChatPage() {
  const allChannels = await db
    .select({
      id: channels.id,
      name: channels.name,
      type: channels.type,
      createdAt: channels.createdAt,
    })
    .from(channels)
    .orderBy(asc(channels.name))
    .limit(25);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Chat</h1>
      <Card>
        <CardHeader><CardTitle>Channels</CardTitle></CardHeader>
        <CardContent>
          {allChannels.length === 0 ? (
            <p className="text-muted-foreground">No channels yet</p>
          ) : (
            <div className="space-y-2">
              {allChannels.map((ch) => (
                <div key={ch.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm"># {ch.name}</p>
                  </div>
                  <Badge variant="secondary">{ch.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
