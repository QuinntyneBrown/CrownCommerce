import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";
import { asc, gte, lte, and } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SchedulePage() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const monthMeetings = await db
    .select({
      id: meetings.id,
      title: meetings.title,
      date: meetings.date,
      startTime: meetings.startTime,
      endTime: meetings.endTime,
      location: meetings.location,
    })
    .from(meetings)
    .where(and(gte(meetings.date, firstDay), lte(meetings.date, lastDay)))
    .orderBy(asc(meetings.date), asc(meetings.startTime))
    .limit(50);

  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Schedule</h1>
      <Card>
        <CardHeader><CardTitle>{monthName}</CardTitle></CardHeader>
        <CardContent>
          {monthMeetings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No meetings scheduled this month</p>
          ) : (
            <div className="space-y-3">
              {monthMeetings.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.date} &middot; {m.startTime} – {m.endTime}</p>
                  </div>
                  {m.location && <Badge variant="secondary">{m.location}</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
