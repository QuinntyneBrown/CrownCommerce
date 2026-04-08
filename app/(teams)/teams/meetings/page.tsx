import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";
import { desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function TeamMeetingsPage() {
  const allMeetings = await db
    .select({
      id: meetings.id,
      title: meetings.title,
      date: meetings.date,
      startTime: meetings.startTime,
      endTime: meetings.endTime,
      location: meetings.location,
    })
    .from(meetings)
    .orderBy(desc(meetings.date))
    .limit(25);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Meetings</h1>
        <Button>Schedule Meeting</Button>
      </div>
      {allMeetings.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No meetings scheduled</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {allMeetings.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.date} &middot; {m.startTime} – {m.endTime}</p>
                </div>
                {m.location && <Badge variant="secondary">{m.location}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
